interface MobileNavigationProps {
  onEmergency: () => void;
  onEvacuate: () => void;
  onReport: () => void;
  onShelters: () => void;
}

export default function MobileNavigation({ onEmergency, onEvacuate, onReport, onShelters }: MobileNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
      <div className="flex justify-around">
        <button 
          onClick={onEmergency}
          className="flex flex-col items-center space-y-1 text-red-500 active:bg-red-50 p-2 rounded"
        >
          <i className="fas fa-phone text-xl"></i>
          <span className="text-xs font-medium">Emergency</span>
        </button>
        
        <button 
          onClick={onEvacuate}
          className="flex flex-col items-center space-y-1 text-blue-500 active:bg-blue-50 p-2 rounded"
        >
          <i className="fas fa-route text-xl"></i>
          <span className="text-xs font-medium">Evacuate</span>
        </button>
        
        <button 
          onClick={onReport}
          className="flex flex-col items-center space-y-1 text-orange-500 active:bg-orange-50 p-2 rounded"
        >
          <i className="fas fa-exclamation text-xl"></i>
          <span className="text-xs font-medium">Report</span>
        </button>
        
        <button 
          onClick={onShelters}
          className="flex flex-col items-center space-y-1 text-green-500 active:bg-green-50 p-2 rounded"
        >
          <i className="fas fa-home text-xl"></i>
          <span className="text-xs font-medium">Shelters</span>
        </button>
      </div>
    </div>
  );
}
