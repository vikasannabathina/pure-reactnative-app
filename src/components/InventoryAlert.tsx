
import React from 'react';
import { Package, PackageX } from 'lucide-react';
import { useMedicine } from '@/context/MedicineContext';

const InventoryAlert = () => {
  const { getLowInventoryMedicines, updateInventory } = useMedicine();
  const lowInventoryMedicines = getLowInventoryMedicines();
  
  if (lowInventoryMedicines.length === 0) {
    return null;
  }
  
  const handleRestock = (id: string, currentAmount: number) => {
    // Add 30 by default when restocking
    updateInventory(id, currentAmount + 30);
  };
  
  return (
    <div className="w-full card mb-5 border-l-4 border-yellow-500 animate-fade-in">
      <div className="flex items-center mb-3">
        <PackageX size={20} className="text-yellow-500 mr-2" />
        <h3 className="text-app-dark-gray font-medium">Inventory Alert</h3>
      </div>
      
      <div className="space-y-3">
        {lowInventoryMedicines.map(medicine => (
          <div key={medicine.id} className="flex justify-between items-center p-3 bg-app-light-gray bg-opacity-30 rounded-lg">
            <div>
              <p className="font-medium text-app-dark-gray">{medicine.name}</p>
              <div className="flex items-center mt-1">
                <Package size={14} className="text-app-gray mr-1" />
                <span className="text-xs text-app-gray">
                  {medicine.inventory.current} of {medicine.type} remaining
                </span>
              </div>
            </div>
            
            <button
              className="px-3 py-1 text-sm bg-app-blue text-white rounded-full hover:bg-app-dark-blue transition-colors"
              onClick={() => handleRestock(medicine.id, medicine.inventory.current)}
            >
              Restock
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryAlert;
