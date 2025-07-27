"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Phone, MapPin, ShoppingCart, Plus, Minus } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface Product {
  id: string
  name: string
  price: number
  unit: string
  description: string
  stock: number
  category: string
}

interface Supplier {
  id: string
  name: string
  rating: number
  location: string
  phone: string
  products: Product[]
  verified: boolean
}

interface ProductDetailsModalProps {
  supplier: Supplier | null
  isOpen: boolean
  onClose: () => void
  onOrder: (supplierId: string, items: { productId: string; quantity: number; price: number }[]) => void
}

export function ProductDetailsModal({ supplier, isOpen, onClose, onOrder }: ProductDetailsModalProps) {
  const { t } = useLanguage()
  const [cart, setCart] = useState<{ [key: string]: number }>({})
  const [isOrdering, setIsOrdering] = useState(false)

  if (!supplier) return null

  const updateQuantity = (productId: string, change: number) => {
    setCart(prev => {
      const newQuantity = (prev[productId] || 0) + change
      if (newQuantity <= 0) {
        const { [productId]: removed, ...rest } = prev
        return rest
      }
      return { ...prev, [productId]: newQuantity }
    })
  }

  const getTotalAmount = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = supplier.products.find(p => p.id === productId)
      return total + (product ? product.price * quantity : 0)
    }, 0)
  }

  const handleOrder = async () => {
    setIsOrdering(true)
    const orderItems = Object.entries(cart).map(([productId, quantity]) => {
      const product = supplier.products.find(p => p.id === productId)!
      return {
        productId,
        quantity,
        price: product.price * quantity
      }
    })
    
    await onOrder(supplier.id, orderItems)
    setCart({})
    setIsOrdering(false)
    onClose()
  }

  const handleContactSupplier = () => {
    // In a real app, this would open phone dialer or messaging
    window.open(`tel:${supplier.phone}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>{supplier.name}</span>
              {supplier.verified && <Badge className="bg-green-600">Verified</Badge>}
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{supplier.rating}</span>
            </div>
          </DialogTitle>
          <DialogDescription className="flex items-center space-x-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {supplier.location}
            </div>
            <Button variant="outline" size="sm" onClick={handleContactSupplier}>
              <Phone className="h-4 w-4 mr-2" />
              Contact Supplier
            </Button>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Available Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supplier.products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{product.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{product.category}</p>
                      <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₹{product.price}/{product.unit}</p>
                      <p className="text-xs text-gray-500">{product.stock} {product.unit} available</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(product.id, -1)}
                        disabled={!cart[product.id]}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center">{cart[product.id] || 0}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(product.id, 1)}
                        disabled={cart[product.id] >= product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {cart[product.id] && (
                      <p className="font-semibold">
                        ₹{(product.price * cart[product.id]).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {Object.keys(cart).length > 0 && (
            <>
              <Separator />
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2">
                  {Object.entries(cart).map(([productId, quantity]) => {
                    const product = supplier.products.find(p => p.id === productId)!
                    return (
                      <div key={productId} className="flex justify-between">
                        <span>{product.name} x {quantity} {product.unit}</span>
                        <span>₹{(product.price * quantity).toLocaleString()}</span>
                      </div>
                    )
                  })}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{getTotalAmount().toLocaleString()}</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  onClick={handleOrder}
                  disabled={isOrdering}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isOrdering ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}