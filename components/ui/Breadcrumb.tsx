import React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-wider font-body text-text-secondary my-6">
      <Link href="/" className="hover:text-dark transition-colors duration-200">
        Home
      </Link>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1
        return (
          <React.Fragment key={idx}>
            <ChevronRight size={10} className="text-text-secondary/55" />
            {isLast || !item.href ? (
              <span className="text-dark font-medium">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-dark transition-colors duration-200">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
