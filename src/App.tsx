import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useEffect, useState } from 'react';
import { localAuth } from '@/db/localAuth';
import { initDB } from '@/db/indexeddb';
import { autoBackupService } from '@/services/autoBackup';
import Header from '@/components/common/Header';
import ContactButton from '@/components/common/ContactButton';
import Footer from '@/components/common/Footer';
import routes from './routes';

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 初始化数据库和认证系统
    async function initialize() {
      try {
        console.log('开始初始化 IndexedDB...');
        await initDB();
        console.log('IndexedDB 初始化成功');
        
        console.log('开始初始化认证系统...');
        await localAuth.initialize();
        console.log('认证系统初始化成功');
        
        // 启动自动备份服务
        console.log('启动自动备份服务...');
        autoBackupService.start();
        console.log('自动备份服务已启动');
        
        setInitialized(true);
      } catch (error) {
        console.error('初始化失败:', error);
        setError(error instanceof Error ? error.message : String(error));
        setInitialized(true); // 仍然显示界面，但可能功能受限
      }
    }
    initialize();

    // 清理函数：组件卸载时停止备份服务
    return () => {
      console.log('停止自动备份服务...');
      autoBackupService.stop();
    };
  }, []);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">正在初始化数据库...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center max-w-md p-6 bg-status-error-bg/30 border border-status-error-border rounded-lg">
          <h2 className="text-xl font-bold text-status-error-text mb-2">初始化错误</h2>
          <p className="text-sm text-status-error-text/80">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-status-error-text text-status-error-bg rounded-lg hover:opacity-90 transition-opacity duration-fast"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster />
      <Header />
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
      <ContactButton />
      <Footer />
    </Router>
  );
}
