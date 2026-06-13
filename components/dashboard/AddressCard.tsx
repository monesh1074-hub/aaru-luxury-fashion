import React from "react"
import { Address } from "@/types"
import { Trash2 } from "lucide-react"
import { Badge } from "../ui/Badge"

interface AddressCardProps {
  address: Address
  onDelete: (id: string) => void
}

export const AddressCard: React.FC<AddressCardProps> = ({ address, onDelete }) => {
  return (
    <div className="border border-border p-5 bg-white relative font-body text-text-primary flex justify-between items-start">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xs uppercase tracking-wider">{address.fullName}</span>
          {address.isDefault && <Badge variant="gold">Default</Badge>}
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          {address.addressLine1}, {address.addressLine2 ? `${address.addressLine2}, ` : ""}
          {address.city}, {address.state} - {address.pincode}
        </p>
        <p className="text-xs text-text-secondary">Mobile: {address.phone}</p>
      </div>

      <button
        onClick={() => onDelete(address.id)}
        className="text-text-secondary hover:text-error transition-colors duration-200 p-1"
        aria-label="Delete address"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}
