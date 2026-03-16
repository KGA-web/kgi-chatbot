import ChatWidget from '@/components/ChatWidget';

export const metadata = {
  title: 'Kaia Chat Widget',
  viewport: 'width=device-width, initial-scale=1',
};

export default function WidgetPage() {
  return (
    <div style={{ 
      margin: 0, 
      padding: 0, 
      height: '100vh', 
      width: '100vw', 
      overflow: 'hidden',
      position: 'fixed',
      bottom: 0,
      right: 0
    }}>
      <ChatWidget embedded={true} />
    </div>
  );
}