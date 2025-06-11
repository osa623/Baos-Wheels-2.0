import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';

interface DebugMobileMenuProps {
  onToggle?: (isOpen: boolean) => void;
}

const DebugMobileMenu = ({ onToggle }: DebugMobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) onToggle(newState);
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col items-end space-y-2">
      <Button 
        onClick={handleToggle}
        variant="secondary"
        className="rounded-full shadow-lg"
      >
        {isOpen ? <X className="h-4 w-4 mr-2" /> : <Menu className="h-4 w-4 mr-2" />}
        Debug Menu
      </Button>
      
      {isOpen && (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <h3 className="font-bold mb-2">Debug Mobile Menu</h3>
          <div className="space-y-2">
            <button 
              className="px-3 py-1 bg-blue-500 text-white rounded w-full text-sm"
              onClick={() => {
                document.getElementById('mobile-menu')?.classList.remove('translate-x-full', 'invisible', 'opacity-0');
                document.getElementById('mobile-menu')?.classList.add('translate-x-0', 'opacity-100');
                document.querySelector('[aria-controls="mobile-menu"]')?.setAttribute('aria-expanded', 'true');
              }}
            >
              Force Open
            </button>
            <button 
              className="px-3 py-1 bg-gray-500 text-white rounded w-full text-sm"
              onClick={() => {
                document.getElementById('mobile-menu')?.classList.add('translate-x-full', 'invisible', 'opacity-0');
                document.getElementById('mobile-menu')?.classList.remove('translate-x-0', 'opacity-100');
                document.querySelector('[aria-controls="mobile-menu"]')?.setAttribute('aria-expanded', 'false');
              }}
            >
              Force Close
            </button>
            <div className="text-xs mt-2 space-y-1">
              <p><strong>CSS Classes:</strong></p>
              <div className="bg-gray-100 p-2 rounded text-[10px] break-all">
                {document.getElementById('mobile-menu')?.className}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugMobileMenu;
