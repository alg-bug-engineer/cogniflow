import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background text-center py-1 z-40">
      <a
        href="http://beian.miit.gov.cn/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 text-xs"
      >
        鲁ICP备2024085839号
      </a>
    </footer>
  );
};

export default Footer;
