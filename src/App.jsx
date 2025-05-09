import React, { useState, useEffect } from 'react';
import Desktop from './components/Win98UI/Desktop';
import LoginScreen from './components/LoginScreen';
import Window from './components/Win98UI/Window';
import Button from './components/Win98UI/Button';
import TrainingDemo from './components/TrainingDemo';
import CameraCapture from './components/CameraCapture';
import './components/Win98UI/styles.css';

const App = () => {
  // 狀態管理
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [activeWindows, setActiveWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);

  // 檢查是否已經登入
  useEffect(() => {
    const savedUsername = localStorage.getItem('win98_username');
    if (savedUsername) {
      setUsername(savedUsername);
      setIsLoggedIn(true);
    }
  }, []);

  // 處理登入
  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  // 處理登出
  const handleLogout = () => {
    localStorage.removeItem('win98_username');
    setUsername('');
    setIsLoggedIn(false);
    setActiveWindows([]);
  };

  // 處理圖標點擊
  const handleIconClick = (icon) => {
    switch (icon.id) {
      case 'vision-trainer':
        openWindow('trainer');
        break;
      case 'my-computer':
        openWindow('my-computer');
        break;
      case 'recyclebin':
        openWindow('recyclebin');
        break;
      case 'help':
        openWindow('help');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  // 打開窗口
  const openWindow = (id) => {
    if (!activeWindows.includes(id)) {
      setActiveWindows([...activeWindows, id]);
    }
    setActiveWindowId(id);
  };

  // 關閉窗口
  const closeWindow = (id) => {
    setActiveWindows(activeWindows.filter(windowId => windowId !== id));
    if (activeWindowId === id) {
      setActiveWindowId(activeWindows.length > 1 ? activeWindows[activeWindows.length - 2] : null);
    }
  };

  // 桌面圖標配置
  const desktopIcons = [
    {
      id: 'vision-trainer',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACZFBMVEUAAADQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICD///+yyAKBAAAAynRSTlMAAAAAAAAAAAAAAAAAAAAAAQUGBwgHBQIQJ0pthZmloZZvTyoRBiRbjKzAxcnMzcrBsJJgJQUlW6DAxcnMzczLyMO6saOGY0YxGw8JB0qBp7vFzM/Qzsy6oFozEC5ZiKS3w8nMzMvHwLejiWU9IBkOCQVDc5WsucHGycnIw7msj2AxFwkMM2mNn6y0u7y8uLKnkHJFIxYNCiVOcYaVnqKioZ6YiXRQKBMKBSlSeImWnZ+fm5N/XjYZCAEHFSMzREpQT0s/LRwNAwECAwQFBQQC+LDR2wAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfjAw4RNCYBwVZ8AAAB9klEQVQ4y2NgQAeMTMwsrGzsHJwYYlzcPLx8/AKCQsIioljiYuISklLSMrJy8gqKSijiyiqKqmrqGppa2jq6evoGhkZGxgaGJqYIcTNzC0sraxtbO3sHRydnF1c3dw9PL28fXz//gMCg4JDQsPCIyKjomNi4+ITEpOSU1LT0jMys7JzcvPyCwqLiktKy8orKquqaWkFBnrr6hsam5pbWtvaOzq7unt6+/gkTJ02eMnXa9BkzZ82eM3fe/AULFy1esnTZ8hUrV61es3bd+g0bN23eYigkJLhl67btO3bu2r1n7779Bw4eOnzk6LHjJ06eOn3m7Dnz8xcuXrp85eq16zdu3rp95+69+w8ePnr85Omz5y9evgKJn9dv3uJ4Ux1v3r57/+Hjp89fvn77/uMnokt+/f7z99//f8ia2BGCXP/+/IIbwIxhACMjE9ACZgwDmJmZWcCC7BgGcHBwcrEChbgZMADRiEhOoAKQAF5OkDQeA/jFJKWkZWTl5OQVJBWVlJWUVdTU1TV5+XCEorEmL5+qmoamljYPj46uni4Dr663j56+L0NAYgIfj4BgkBAPj1BoWLiwSIRoZBTI1OiYWDFxfu2ExKRkkKaU1DRJqfQMaZnMrGwemZzcvPyCwiJZ4eKSUjnzMgYGWfmK8koGhqrqmupaBoZ6/QYAvYLKsXv72wIAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDMtMTRUMTc6NTI6MzgrMDE6MDBWQAIhAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTAzLTE0VDE3OjUyOjM4KzAxOjAwJx26nQAAAFd6VFh0UmF3IHByb2ZpbGUgdHlwZSBpcHRjAAB4nOPyDAhxVigoyk/LzEnlUgADIwsuYwsTIxNLkxQDEyBEgDTDZAMjs1Qgy9jUyMTMxBzEB8uASKBKLgDqFxF08kI1lQAAAABJRU5ErkJggg==',
      label: '機器視覺訓練'
    },
    {
      id: 'my-computer',
      icon: 'my-computer',
      label: '我的電腦'
    },
    {
      id: 'recyclebin',
      icon: 'recycle-bin',
      label: '資源回收筒'
    },
    {
      id: 'help',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABI1BMVEUAAAA/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9v///+SJwGTAAAAYHRSTlMAAAAAAAAAAAAAAA9GcJSrGjid3TMGleUJqQFj9h1R8jvpBIT7FkrrM+AEefoRQOUu0gJ4/VnoLMsCePXCIe8Cd/gYkwEyJC0dCBRdp9TiyqN5Vz4qEwINIjtNWmNjUDsnFxECVh6cAAAAAWJLR0RhFMYpMQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+MIBgUbAT0qLQQAAAElSURBVDjL1dLZUsIwFAbgSNO0FBAQoYogLqigKO6iIu6KK+4K6Ps/hCdNaUtamAvH8V64SPL9k5lMziAUolBYUVXtT2BZNoRhiEKGaTq66/7PdcNBEZYVSTdIlCCMsuM6VZ/juK5DagRhJpO1GJPNZAio3+tNp0KhNhFC8bXa5zrqjQ2CcJPX1SjCLb691trbdBCKhAg7PN/ZsXcJwl0s7aG9/QOCcFg3+sjTRkg+JgjrJyfBCYIQjM8k85zLfXEhP1+OLq+ubwxwi8nt3f2D2QP18PhEhufCBZOXVwEvb2/0NaBSrdXrH42mbH40G9+fX9VKWULoK5l2KbHYiiTzlSIU8GlKVCShULRYaTSJFc2S3lRuMZZyE7MlVIiXHcbKDjdXEFH0C5qJoKdS2aJ9AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA4LTA2VDA1OjI3OjAxKzAwOjAwBKCG3QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wOC0wNlQwNToyNzowMSswMDowMHX9PmEAAAAASUVORK5CYII=',
      label: '說明'
    },
    {
      id: 'logout',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABpFBMVEUAAADWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzPWMzP///+SQQz+AAAAinRSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABCxgqOD48MiAOBAYfRGR6jJymnIx6ZEQkAxdo4/v05mwZCEep+PyuTBJj9/tjD2H2+GEPFKr7qhQMia+vjgxDqfqpRBdl9/ZlFwQbSKDm5qBIHAQDGUyAmpqATBkDAQUOIDhKXFxKOCEOBQG9FYksAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+MIBgUbMSmUPAwAAAGsSURBVDjLY2AgATAyMbOwsrFzcGKIc/HwsrDy8QsICmGICwuIiIqJS0gKCUthiEsDFcsoKCopq4grqmHIq4vJyGpoamnr6OrpG2CIGxoZm5iamVtYWlnbYPrG1s7ewdHJ2cXVDcM97h6eXt4+vn7+AYEYngoKDgmNiIyKjomNw/BdfEJiUnJKalp6BiOKQGZWdk5uXn5BYVERI4pbiksSS8vKKyqrqmvQAqK2rrK+obGpuaW1jRFZoL2js6u7p7evf8LESSgCk6dMnTZ9xsxZs+fMRReYN3/BwkWLlyxdtnwFmsrUlStrV69Zu279ho1oAps2b9m6bfuOnbv27kMV2H/g4KHDR44eO37iJKrAqdNnzp47f+HipctX0D1z9dr1Gzdv3b5z9x6ae+4/ePjo8ZOnz56/eIkeTS9fvX7z9t37Dx/RY/rT5y9fv33/8ZOBAUPg129GJmYWVgxxoACDIBOzCJY0wcjGjOYKXgYGXhE0cW4GBm4RET5UcSEgEBURNwBqZQRhCYxUwcgIVCUGxPw84kjivEAFvLwiSBohomKiIhJQ1eLmZmL4hws2cgEAyW2NPRuCj7cAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDgtMDZUMDU6Mjc6MzMrMDA6MDCIud13AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA4LTA2VDA1OjI3OjMzKzAwOjAw+eRlywAAAABJRU5ErkJggg==',
      label: '登出'
    }
  ];

  // 窗口配置
  const windows = [
    {
      id: 'trainer',
      title: '機器視覺訓練',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACZFBMVEUAAADQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICDQICD///+yyAKBAAAAynRSTlMAAAAAAAAAAAAAAAAAAAAAAQUGBwgHBQIQJ0pthZmloZZvTyoRBiRbjKzAxcnMzcrBsJJgJQUlW6DAxcnMzczLyMO6saOGY0YxGw8JB0qBp7vFzM/Qzsy6oFozEC5ZiKS3w8nMzMvHwLejiWU9IBkOCQVDc5WsucHGycnIw7msj2AxFwkMM2mNn6y0u7y8uLKnkHJFIxYNCiVOcYaVnqKioZ6YiXRQKBMKBSlSeImWnZ+fm5N/XjYZCAEHFSMzREpQT0s/LRwNAwECAwQFBQQC+LDR2wAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfjAw4RNCYBwVZ8AAAB9klEQVQ4y2NgQAeMTMwsrGzsHJwYYlzcPLx8/AKCQsIioljiYuISklLSMrJy8gqKSijiyiqKqmrqGppa2jq6evoGhkZGxgaGJqYIcTNzC0sraxtbO3sHRydnF1c3dw9PL28fXz//gMCg4JDQsPCIyKjomNi4+ITEpOSU1LT0jMys7JzcvPyCwqLiktKy8orKquqaWkFBnrr6hsam5pbWtvaOzq7unt6+/gkTJ02eMnXa9BkzZ82eM3fe/AULFy1esnTZ8hUrV61es3bd+g0bN23eYigkJLhl67btO3bu2r1n7779Bw4eOnzk6LHjJ06eOn3m7Dnz8xcuXrp85eq16zdu3rp95+69+w8ePnr85Omz5y9evgKJn9dv3uJ4Ux1v3r57/+Hjp89fvn77/uMnokt+/f7z99//f8ia2BGCXP/+/IIbwIxhACMjE9ACZgwDmJmZWcCC7BgGcHBwcrEChbgZMADRiEhOoAKQAF5OkDQeA/jFJKWkZWTl5OQVJBWVlJWUVdTU1TV5+XCEorEmL5+qmoamljYPj46uni4Dr653j56+L0NAYgIfj4BgkBAPj1BoWLiwSIRoZBTI1OiYWDFxfu2ExKRkkKaU1DRJqfQMaZnMrGwemZzcvPyCwiJZ4eKSUjnzMgYGWfmK8koGhqrqmupaBoZ6/QYAvYLKsXv72wIAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDMtMTRUMTc6NTI6MzgrMDE6MDBWQAIhAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTAzLTE0VDE3OjUyOjM4KzAxOjAwJx26nQAAAFd6VFh0UmF3IHByb2ZpbGUgdHlwZSBpcHRjAAB4nOPyDAhxVigoyk/LzEnlUgADIwsuYwsTIxNLkxQDEyBEgDTDZAMjs1Qgy9jUyMTMxBzEB8uASKBKLgDqFxF08kI1lQAAAABJRU5ErkJggg==',
      content: <TrainingDemo onClose={() => closeWindow('trainer')} />,
      position: { x: 100, y: 100 },
      size: { width: 700, height: 500 },
      resizable: true,
      minimizable: true,
      maximizable: true
    },
    {
      id: 'my-computer',
      title: '我的電腦',
      icon: 'my-computer',
      content: (
        <div className="win98-computer-content">
          <h3>我的電腦</h3>
          <p>這是一個簡化的Windows 98界面模擬，用於展示機器視覺訓練系統。</p>
          <p>請點擊桌面上的「機器視覺訓練」圖標來開始體驗。</p>
        </div>
  );
};

export default App;
      ),
      position: { x: 150, y: 120 },
      size: { width: 400, height: 300 },
      resizable: true,
      minimizable: true,
      maximizable: true
    },
    {
      id: 'recyclebin',
      title: '資源回收筒',
      icon: 'recycle-bin',
      content: (
        <div className="win98-recyclebin-content">
          <div className="win98-empty-container">
            <p>資源回收筒是空的</p>
            <Button onClick={() => closeWindow('recyclebin')}>關閉</Button>
          </div>
        </div>
      ),
      position: { x: 200, y: 150 },
      size: { width: 350, height: 250 },
      resizable: true,
      minimizable: true,
      maximizable: true
    },
    {
      id: 'help',
      title: '說明',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABI1BMVEUAAAA/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9s/k9v///+SJwGTAAAAYHRSTlMAAAAAAAAAAAAAAA9GcJSrGjid3TMGleUJqQFj9h1R8jvpBIT7FkrrM+AEefoRQOUu0gJ4/VnoLMsCePXCIe8Cd/gYkwEyJC0dCBRdp9TiyqN5Vz4qEwINIjtNWmNjUDsnFxECVh6cAAAAAWJLR0RhFMYpMQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+MIBgUbAT0qLQQAAAElSURBVDjL1dLZUsIwFAbgSNO0FBAQoYogLqigKO6iIu6KK+4K6Ps/hCdNaUtamAvH8V64SPL9k5lMziAUolBYUVXtT2BZNoRhiEKGaTq66/7PdcNBEZYVSTdIlCCMsuM6VZ/juK5DagRhJpO1GJPNZAio3+tNp0KhNhFC8bXa5zrqjQ2CcJPX1SjCLb691trbdBCKhAg7PN/ZsXcJwl0s7aG9/QOCcFg3+sjTRkg+JgjrJyfBCYIQjM8k85zLfXEhP1+OLq+ubwxwi8nt3f2D2QP18PhEhufCBZOXVwEvb2/0NaBSrdXrH42mbH40G9+fX9VKWULoK5l2KbHYiiTzlSIU8GlKVCShULRYaTSJFc2S3lRuMZZyE7MlVIiXHcbKDjdXEFH0C5qJoKdS2aJ9AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTA4LTA2VDA1OjI3OjAxKzAwOjAwBKCG3QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wOC0wNlQwNToyNzowMSswMDowMHX9PmEAAAAASUVORK5CYII=',
      content: (
        <div className="win98-help-content">
          <h3>使用說明</h3>
          <div className="win98-help-section">
            <h4>基本操作</h4>
            <ul>
              <li>點擊桌面上的「機器視覺訓練」圖標開始體驗</li>
              <li>窗口可以拖動、調整大小、最小化和最大化</li>
              <li>點擊窗口右上角的 X 按鈕關閉窗口</li>
            </ul>
          </div>
          <div className="win98-help-section">
            <h4>機器視覺訓練流程</h4>
            <ol>
              <li>拍攝或上傳樣本圖像</li>
              <li>觀看圖像預處理過程</li>
              <li>體驗資料增強效果展示</li>
              <li>模擬訓練過程並查看結果</li>
            </ol>
          </div>
          <div className="win98-help-actions">
            <Button onClick={() => closeWindow('help')}>關閉說明</Button>
          </div>
        </div>
      ),