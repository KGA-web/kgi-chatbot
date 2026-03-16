import ChatWidget from '@/components/ChatWidget';

export default function WidgetPage() {
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      zIndex: 9999 
    }}>
      <ChatWidget embedded={true} />
    </div>
  );
}
