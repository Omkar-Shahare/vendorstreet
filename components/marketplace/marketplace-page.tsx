"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { useLanguage } from "@/hooks/use-language"
import { ProductDetailsModal } from "./product-details-modal"
import { useToast } from "@/hooks/use-toast"
import { Search, Star, MapPin, ShoppingCart } from "lucide-react"

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
  category: string
  products: Product[]
  priceRange: string
  verified: boolean
  image: string
  phone: string
}

export function MarketplacePage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Demo data
    const demoSuppliers: Supplier[] = [
      {
        id: "1",
        name: "Fresh Vegetables Co.",
        rating: 4.8,
        location: "Mumbai, Maharashtra",
        category: "vegetables",
        products: [
          { id: "1", name: "Fresh Onions", price: 25, unit: "kg", description: "Premium quality red onions", stock: 500, category: "vegetables" },
          { id: "2", name: "Tomatoes", price: 30, unit: "kg", description: "Fresh ripe tomatoes", stock: 300, category: "vegetables" },
          { id: "3", name: "Potatoes", price: 20, unit: "kg", description: "High quality potatoes", stock: 400, category: "vegetables" },
          { id: "4", name: "Carrots", price: 35, unit: "kg", description: "Fresh carrots", stock: 200, category: "vegetables" }
        ],
        priceRange: "₹20-50/kg",
        verified: true,
        image: "/placeholder.svg?height=200&width=300",
        phone: "+91 98765 43210",
      },
      {
        id: "2",
        name: "Spice Masters",
        rating: 4.6,
        location: "Delhi, NCR",
        category: "spices",
        products: [
          { id: "5", name: "Turmeric Powder", price: 180, unit: "kg", description: "Pure turmeric powder", stock: 50, category: "spices" },
          { id: "6", name: "Red Chili Powder", price: 200, unit: "kg", description: "Hot red chili powder", stock: 40, category: "spices" },
          { id: "7", name: "Coriander Powder", price: 150, unit: "kg", description: "Fresh coriander powder", stock: 60, category: "spices" },
          { id: "8", name: "Cumin Seeds", price: 300, unit: "kg", description: "Premium cumin seeds", stock: 30, category: "spices" }
        ],
        priceRange: "₹100-300/kg",
        verified: true,
        image: "/placeholder.svg?height=200&width=300",
        phone: "+91 87654 32109",
      },
      {
        id: "3",
        name: "Oil & More",
        rating: 4.5,
        location: "Pune, Maharashtra",
        category: "oils",
        products: [
          { id: "9", name: "Sunflower Oil", price: 120, unit: "L", description: "Pure sunflower oil", stock: 100, category: "oils" },
          { id: "10", name: "Mustard Oil", price: 140, unit: "L", description: "Cold pressed mustard oil", stock: 80, category: "oils" },
          { id: "11", name: "Coconut Oil", price: 200, unit: "L", description: "Virgin coconut oil", stock: 60, category: "oils" }
        ],
        priceRange: "₹80-150/L",
        verified: true,
        image: "/placeholder.svg?height=200&width=300",
        phone: "+91 76543 21098",
      },
      {
        id: "4",
        name: "Grain Suppliers Ltd.",
        rating: 4.7,
        location: "Bangalore, Karnataka",
        category: "grains",
        products: [
          { id: "12", name: "Basmati Rice", price: 80, unit: "kg", description: "Premium basmati rice", stock: 200, category: "grains" },
          { id: "13", name: "Wheat Flour", price: 40, unit: "kg", description: "Fresh wheat flour", stock: 300, category: "grains" },
          { id: "14", name: "Toor Dal", price: 120, unit: "kg", description: "High quality toor dal", stock: 150, category: "grains" },
          { id: "15", name: "Quinoa", price: 400, unit: "kg", description: "Organic quinoa", stock: 50, category: "grains" }
        ],
        priceRange: "₹30-80/kg",
        verified: true,
        image: "/placeholder.svg?height=200&width=300",
        phone: "+91 65432 10987",
      },
      {
        id: "5",
        name: "Dairy Fresh",
        rating: 4.4,
        location: "Chennai, Tamil Nadu",
        category: "dairy",
        products: [
          { id: "16", name: "Fresh Milk", price: 50, unit: "L", description: "Fresh cow milk", stock: 100, category: "dairy" },
          { id: "17", name: "Paneer", price: 300, unit: "kg", description: "Fresh paneer", stock: 50, category: "dairy" },
          { id: "18", name: "Butter", price: 400, unit: "kg", description: "Pure butter", stock: 30, category: "dairy" },
          { id: "19", name: "Yogurt", price: 60, unit: "kg", description: "Fresh yogurt", stock: 80, category: "dairy" }
        ],
        priceRange: "₹40-200/unit",
        verified: false,
        image: "/placeholder.svg?height=200&width=300",
        phone: "+91 54321 09876",
      },
    ]

    setSuppliers(demoSuppliers)
    setFilteredSuppliers(demoSuppliers)
  }, [])

  useEffect(() => {
    let filtered = suppliers

    if (searchTerm) {
      filtered = filtered.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.products.some((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((supplier) => supplier.category === categoryFilter)
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter((supplier) => supplier.location.toLowerCase().includes(locationFilter.toLowerCase()))
    }

    setFilteredSuppliers(filtered)
  }, [searchTerm, categoryFilter, locationFilter, suppliers])

  const handleViewProducts = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setIsModalOpen(true)
  }

  const handleOrder = async (supplierId: string, items: { productId: string; quantity: number; price: number }[]) => {
    // In a real app, this would make an API call to create the order
    console.log('Creating order:', { supplierId, items })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: "Order Placed Successfully!",
      description: `Your order has been placed and will be processed soon.`,
    })
    
    // In a real app, this would update the orders in the backend
    // and the orders page would fetch the updated data
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("supplier_marketplace")}</h1>
          <p className="text-gray-600">{t("marketplace_subtitle")}</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t("search_suppliers")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t("category")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all_categories")}</SelectItem>
                <SelectItem value="vegetables">{t("vegetables")}</SelectItem>
                <SelectItem value="spices">{t("spices")}</SelectItem>
                <SelectItem value="oils">{t("oils")}</SelectItem>
                <SelectItem value="grains">{t("grains")}</SelectItem>
                <SelectItem value="dairy">{t("dairy")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t("location")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all_locations")}</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="pune">Pune</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="chennai">Chennai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={supplier.image || "/placeholder.svg"}
                  alt={supplier.name}
                  className="w-full h-full object-cover"
                />
                {supplier.verified && <Badge className="absolute top-2 right-2 bg-green-600">{t("verified")}</Badge>}
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{supplier.name}</CardTitle>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{supplier.rating}</span>
                  </div>
                </div>
                <CardDescription className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {supplier.location}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">{t("products")}:</p>
                    <div className="flex flex-wrap gap-1">
                      {supplier.products.slice(0, 3).map((product, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {product.name}
                        </Badge>
                      ))}
                      {supplier.products.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{supplier.products.length - 3} {t("more")}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-600">{supplier.priceRange}</span>
                    <Button size="sm" onClick={() => handleViewProducts(supplier)}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {t("view_products")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSuppliers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t("no_suppliers_found")}</p>
            <p className="text-gray-400 mt-2">{t("try_different_filters")}</p>
          </div>
        )}
      </div>

      <ProductDetailsModal
        supplier={selectedSupplier}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOrder={handleOrder}
      />
    </div>
  )
}
