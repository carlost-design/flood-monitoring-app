interface EmergencyAlertProps {
  message: string;
  onClose: () => void;
}

export default function EmergencyAlert({ message, onClose }: EmergencyAlertProps) {
  return (
    <div className="bg-red-500 text-white p-4 text-center relative">
      <div className="container mx-auto flex items-center justify-center space-x-2">
        <i className="fas fa-exclamation-triangle text-xl animate-pulse"></i>
        <span className="font-semibold text-lg">{message}</span>
        <button 
          onClick={onClose}
          className="absolute right-4 text-white hover:text-gray-200 transition-colors"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
}
