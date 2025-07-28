"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import { Navigation } from "@/components/navigation"
import { useToast } from "@/hooks/use-toast"
import { 
  Package, 
  TrendingUp, 
  ShoppingCart, 
  Star, 
  Bell, 
  Plus, 
  Camera, 
  Upload, 
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  MessageCircle,
  IndianRupee,
  TrendingDown,
  Users,
  Eye,
  Phone,
  Mail
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"

interface SupplierStats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  canceledOrders: number
  monthlyRevenue: number
  weeklyRevenue: number
  averageRating: number
  totalProducts: number
  lowStockItems: number
}

interface Product {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  unit: string
  stock: number
  minStock: number
  description: string
  image?: string
  available: boolean
  discount?: number
  createdAt: string
}

interface Order {
  id: string
  vendorName: string
  vendorPhone: string
  vendorEmail: string
  items: { productId: string; productName: string; quantity: number; price: number }[]
  totalAmount: number
  status: "pending" | "accepted" | "processing" | "dispatched" | "delivered" | "canceled"
  orderDate: string
  deliveryAddress: string
  notes?: string
  estimatedDelivery?: string
}

interface Notification {
  id: string
  type: "order" | "inventory" | "message" | "payment"
  title: string
  message: string
  timestamp: string
  read: boolean
}

export function SupplierDashboard() {
  const { user, profile, loading } = useAuth()
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  
  const [stats, setStats] = useState<SupplierStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    canceledOrders: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0,
    averageRating: 0,
    totalProducts: 0,
    lowStockItems: 0,
  })
  
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    unit: '',
    stock: '',
    minStock: '',
    description: '',
    discount: '',
    available: true
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
      return
    }

    if (user && profile?.userType === 'supplier') {
      loadSupplierData()
    }
  }, [user, loading, router, profile])

  const loadSupplierData = () => {
    // Load from localStorage or set demo data
    const savedProducts = localStorage.getItem('supplier-products')
    const savedOrders = localStorage.getItem('supplier-orders')
    const savedNotifications = localStorage.getItem('supplier-notifications')

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      const demoProducts: Product[] = [
        {
          id: '1',
          name: 'Fresh Onions',
          category: 'vegetables',
          price: 25,
          originalPrice: 30,
          unit: 'kg',
          stock: 500,
          minStock: 50,
          description: 'Premium quality red onions, fresh from farm',
          available: true,
          discount: 17,
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Tomatoes',
          category: 'vegetables',
          price: 30,
          unit: 'kg',
          stock: 300,
          minStock: 30,
          description: 'Fresh ripe tomatoes, perfect for cooking',
          available: true,
          createdAt: '2024-01-16'
        },
        {
          id: '3',
          name: 'Turmeric Powder',
          category: 'spices',
          price: 180,
          unit: 'kg',
          stock: 15,
          minStock: 20,
          description: 'Pure turmeric powder, high quality',
          available: true,
          createdAt: '2024-01-17'
        }
      ]
      setProducts(demoProducts)
      localStorage.setItem('supplier-products', JSON.stringify(demoProducts))
    }

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    } else {
      const demoOrders: Order[] = [
        {
          id: 'ORD-001',
          vendorName: 'Raj Kumar',
          vendorPhone: '+91 98765 43210',
          vendorEmail: 'raj@example.com',
          items: [
            { productId: '1', productName: 'Fresh Onions', quantity: 10, price: 250 },
            { productId: '2', productName: 'Tomatoes', quantity: 5, price: 150 }
          ],
          totalAmount: 400,
          status: 'pending',
          orderDate: '2024-01-21',
          deliveryAddress: 'Shop 15, Andheri Market, Mumbai',
          estimatedDelivery: '2024-01-23'
        },
        {
          id: 'ORD-002',
          vendorName: 'Priya Sharma',
          vendorPhone: '+91 87654 32109',
          vendorEmail: 'priya@example.com',
          items: [
            { productId: '3', productName: 'Turmeric Powder', quantity: 2, price: 360 }
          ],
          totalAmount: 360,
          status: 'processing',
          orderDate: '2024-01-20',
          deliveryAddress: 'Stall 8, Karol Bagh, Delhi',
          estimatedDelivery: '2024-01-22'
        }
      ]
      setOrders(demoOrders)
      localStorage.setItem('supplier-orders', JSON.stringify(demoOrders))
    }

    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    } else {
      const demoNotifications: Notification[] = [
        {
          id: '1',
          type: 'order',
          title: 'New Order Received',
          message: 'Raj Kumar placed an order worth ₹400',
          timestamp: '2024-01-21T10:30:00Z',
          read: false
        },
        {
          id: '2',
          type: 'inventory',
          title: 'Low Stock Alert',
          message: 'Turmeric Powder is running low (15 kg remaining)',
          timestamp: '2024-01-21T09:15:00Z',
          read: false
        },
        {
          id: '3',
          type: 'message',
          title: 'Message from Vendor',
          message: 'Priya Sharma asked about delivery time',
          timestamp: '2024-01-20T16:45:00Z',
          read: true
        }
      ]
      setNotifications(demoNotifications)
      localStorage.setItem('supplier-notifications', JSON.stringify(demoNotifications))
    }

    // Calculate stats
    const totalOrders = orders.length
    const pendingOrders = orders.filter(o => o.status === 'pending').length
    const completedOrders = orders.filter(o => o.status === 'delivered').length
    const canceledOrders = orders.filter(o => o.status === 'canceled').length
    const monthlyRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const lowStockItems = products.filter(p => p.stock <= p.minStock).length

    setStats({
      totalOrders,
      pendingOrders,
      completedOrders,
      canceledOrders,
      monthlyRevenue,
      weeklyRevenue: monthlyRevenue * 0.25, // Approximate
      averageRating: 4.6,
      totalProducts: products.length,
      lowStockItems
    })
  }

  const handleImageUpload = (type: 'camera' | 'gallery') => {
    if (type === 'camera') {
      // In a real app, this would open the camera
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            toast({
              title: "Camera Access Granted",
              description: "You can now take photos of your products",
            })
            // Stop the stream for demo
            stream.getTracks().forEach(track => track.stop())
          })
          .catch(err => {
            toast({
              title: "Camera Access Denied",
              description: "Please allow camera access to take product photos",
              variant: "destructive"
            })
          })
      }
    } else {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          toast({
            title: "Image Selected",
            description: `Selected: ${file.name}`,
          })
        }
      }
      input.click()
    }
  }

  const handleAddProduct = () => {
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
      unit: newProduct.unit,
      stock: parseInt(newProduct.stock),
      minStock: parseInt(newProduct.minStock),
      description: newProduct.description,
      available: newProduct.available,
      discount: newProduct.discount ? parseInt(newProduct.discount) : undefined,
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    const updatedProducts = [...products, product]
    setProducts(updatedProducts)
    localStorage.setItem('supplier-products', JSON.stringify(updatedProducts))
    
    setNewProduct({
      name: '', category: '', price: '', originalPrice: '', unit: '', 
      stock: '', minStock: '', description: '', discount: '', available: true
    })
    setIsAddProductOpen(false)
    
    toast({
      title: "Product Added Successfully!",
      description: `${product.name} has been added to your catalog`,
    })
  }

  const handleEditProduct = () => {
    if (!selectedProduct) return
    
    const updatedProduct: Product = {
      ...selectedProduct,
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
      unit: newProduct.unit,
      stock: parseInt(newProduct.stock),
      minStock: parseInt(newProduct.minStock),
      description: newProduct.description,
      available: newProduct.available,
      discount: newProduct.discount ? parseInt(newProduct.discount) : undefined,
    }
    
    const updatedProducts = products.map(p => p.id === selectedProduct.id ? updatedProduct : p)
    setProducts(updatedProducts)
    localStorage.setItem('supplier-products', JSON.stringify(updatedProducts))
    
    setIsEditProductOpen(false)
    setSelectedProduct(null)
    
    toast({
      title: "Product Updated Successfully!",
      description: `${updatedProduct.name} has been updated`,
    })
  }

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = products.filter(p => p.id !== productId)
    setProducts(updatedProducts)
    localStorage.setItem('supplier-products', JSON.stringify(updatedProducts))
    
    toast({
      title: "Product Deleted",
      description: "Product has been removed from your catalog",
    })
  }

  const handleOrderStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    setOrders(updatedOrders)
    localStorage.setItem('supplier-orders', JSON.stringify(updatedOrders))
    
    toast({
      title: "Order Status Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    })
  }

  const openEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      unit: product.unit,
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      description: product.description,
      discount: product.discount?.toString() || '',
      available: product.available
    })
    setIsEditProductOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'dispatched': return 'bg-orange-100 text-orange-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'canceled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'processing': return <Package className="h-4 w-4" />
      case 'dispatched': return <Truck className="h-4 w-4" />
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const unreadNotifications = notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile || profile.userType !== 'supplier') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {profile.name}!
            </h1>
            <p className="text-gray-600 mt-2">Manage your products and orders efficiently</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setIsAddProductOpen(true)} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Dashboard Overview */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("orders")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingOrders} pending • {stats.completedOrders} completed
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("products")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.lowStockItems} low stock alerts
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab("analytics")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.averageRating}</div>
                  <p className="text-xs text-muted-foreground">Based on 45 reviews</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" onClick={() => setIsAddProductOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Product
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" onClick={() => setActiveTab("orders")}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    View Pending Orders ({stats.pendingOrders})
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" onClick={() => setActiveTab("products")}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Check Low Stock ({stats.lowStockItems})
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest orders from vendors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold">{order.id}</h4>
                          <p className="text-sm text-gray-600">{order.vendorName}</p>
                          <p className="text-sm font-medium">₹{order.totalAmount}</p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Management */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Product Catalog</h2>
                <p className="text-gray-600">Manage your products and inventory</p>
              </div>
              <Button onClick={() => setIsAddProductOpen(true)} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Low Stock Alerts */}
            {stats.lowStockItems > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-800">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Low Stock Alert
                  </CardTitle>
                  <CardDescription className="text-orange-700">
                    {stats.lowStockItems} products are running low on stock
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center relative">
                      <Package className="h-12 w-12 text-gray-400" />
                      {product.discount && (
                        <Badge className="absolute top-2 right-2 bg-red-500">
                          -{product.discount}%
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{product.name}</h3>
                        <Switch 
                          checked={product.available} 
                          onCheckedChange={(checked) => {
                            const updatedProducts = products.map(p => 
                              p.id === product.id ? { ...p, available: checked } : p
                            )
                            setProducts(updatedProducts)
                            localStorage.setItem('supplier-products', JSON.stringify(updatedProducts))
                          }}
                        />
                      </div>
                      
                      <p className="text-sm text-gray-600 capitalize">{product.category}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          {product.originalPrice && product.discount ? (
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-green-600">₹{product.price}/{product.unit}</span>
                              <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                            </div>
                          ) : (
                            <span className="font-bold text-green-600">₹{product.price}/{product.unit}</span>
                          )}
                        </div>
                        <Badge variant={product.stock <= product.minStock ? "destructive" : "default"}>
                          {product.stock} {product.unit}
                        </Badge>
                      </div>
                      
                      {product.stock <= product.minStock && (
                        <div className="flex items-center text-red-600 text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Low Stock
                        </div>
                      )}
                      
                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditProduct(product)}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Management */}
          <TabsContent value="orders" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Order Management</h2>
              <p className="text-gray-600">Track and fulfill vendor orders</p>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {order.id}
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Order from {order.vendorName} • {order.orderDate}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">₹{order.totalAmount}</p>
                        {order.estimatedDelivery && (
                          <p className="text-sm text-gray-600">
                            Est. delivery: {order.estimatedDelivery}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Order Items:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                            <div>
                              <span className="font-medium">{item.productName}</span>
                              <span className="text-gray-600 ml-2">({item.quantity} units)</span>
                            </div>
                            <span className="font-semibold">₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">Contact</p>
                            <p className="text-sm text-gray-600">{order.vendorPhone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-gray-600">{order.vendorEmail}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Package className="h-4 w-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm font-medium">Delivery Address</p>
                          <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t">
                      {order.status === 'pending' && (
                        <>
                          <Button variant="outline" onClick={() => handleOrderStatusUpdate(order.id, 'canceled')}>
                            Reject Order
                          </Button>
                          <Button onClick={() => handleOrderStatusUpdate(order.id, 'accepted')}>
                            Accept Order
                          </Button>
                        </>
                      )}
                      {order.status === 'accepted' && (
                        <Button onClick={() => handleOrderStatusUpdate(order.id, 'processing')}>
                          Start Processing
                        </Button>
                      )}
                      {order.status === 'processing' && (
                        <Button onClick={() => handleOrderStatusUpdate(order.id, 'dispatched')}>
                          Mark as Dispatched
                        </Button>
                      )}
                      {order.status === 'dispatched' && (
                        <Button onClick={() => handleOrderStatusUpdate(order.id, 'delivered')}>
                          Mark as Delivered
                        </Button>
                      )}
                      <Button variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Vendor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Analytics & Reports</h2>
              <p className="text-gray-600">Track your business performance</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Your earnings breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>This Month</span>
                    <span className="font-semibold text-green-600">₹{stats.monthlyRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>This Week</span>
                    <span className="font-semibold">₹{stats.weeklyRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Order Value</span>
                    <span className="font-semibold">₹{Math.round(stats.monthlyRevenue / stats.totalOrders)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>Your best performers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {products.slice(0, 3).map((product, index) => (
                    <div key={product.id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">#{index + 1}</span>
                        <span>{product.name}</span>
                      </div>
                      <span className="font-semibold">{Math.floor(Math.random() * 50) + 10} orders</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Statistics</CardTitle>
                  <CardDescription>Order fulfillment breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Completed Orders</span>
                      <span>{stats.completedOrders}</span>
                    </div>
                    <Progress value={(stats.completedOrders / stats.totalOrders) * 100} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Pending Orders</span>
                      <span>{stats.pendingOrders}</span>
                    </div>
                    <Progress value={(stats.pendingOrders / stats.totalOrders) * 100} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Satisfaction</CardTitle>
                  <CardDescription>Ratings and feedback</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-2xl font-bold">{stats.averageRating}</span>
                    <span className="text-gray-600">/ 5.0</span>
                  </div>
                  <p className="text-sm text-gray-600">Based on 45 reviews</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>5 stars</span>
                      <span>32 reviews</span>
                    </div>
                    <Progress value={71} />
                    <div className="flex justify-between text-sm">
                      <span>4 stars</span>
                      <span>10 reviews</span>
                    </div>
                    <Progress value={22} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Notifications & Alerts</h2>
              <p className="text-gray-600">Stay updated with important information</p>
            </div>

            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card key={notification.id} className={`hover:shadow-lg transition-shadow ${!notification.read ? 'border-orange-200 bg-orange-50' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {notification.type === 'order' && <ShoppingCart className="h-5 w-5 text-blue-600" />}
                        {notification.type === 'inventory' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                        {notification.type === 'message' && <MessageCircle className="h-5 w-5 text-green-600" />}
                        {notification.type === 'payment' && <IndianRupee className="h-5 w-5 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Product Modal */}
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Add a new product to your catalog</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="e.g., Fresh Onions"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="spices">Spices</SelectItem>
                    <SelectItem value="oils">Oils</SelectItem>
                    <SelectItem value="grains">Grains</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    placeholder="25"
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                    placeholder="30"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit">Unit *</Label>
                  <Select value={newProduct.unit} onValueChange={(value) => setNewProduct({...newProduct, unit: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="piece">piece</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discount">Discount %</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={newProduct.discount}
                    onChange={(e) => setNewProduct({...newProduct, discount: e.target.value})}
                    placeholder="10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="minStock">Min Stock Alert</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={newProduct.minStock}
                    onChange={(e) => setNewProduct({...newProduct, minStock: e.target.value})}
                    placeholder="20"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Describe your product..."
                />
              </div>
              
              <div>
                <Label>Product Image</Label>
                <div className="flex space-x-2 mt-2">
                  <Button variant="outline" size="sm" onClick={() => handleImageUpload('camera')}>
                    <Camera className="h-4 w-4 mr-2" />
                    Camera
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleImageUpload('gallery')}>
                    <Upload className="h-4 w-4 mr-2" />
                    Gallery
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={newProduct.available} 
                  onCheckedChange={(checked) => setNewProduct({...newProduct, available: checked})}
                />
                <Label>Available for sale</Label>
              </div>
              
              <Button onClick={handleAddProduct} className="w-full">
                Add Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Product Modal */}
        <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Update product information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Product Name *</Label>
                <Input
                  id="edit-name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="spices">Spices</SelectItem>
                    <SelectItem value="oils">Oils</SelectItem>
                    <SelectItem value="grains">Grains</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Price *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-originalPrice">Original Price</Label>
                  <Input
                    id="edit-originalPrice"
                    type="number"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-stock">Stock Quantity *</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-minStock">Min Stock Alert</Label>
                  <Input
                    id="edit-minStock"
                    type="number"
                    value={newProduct.minStock}
                    onChange={(e) => setNewProduct({...newProduct, minStock: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={newProduct.available} 
                  onCheckedChange={(checked) => setNewProduct({...newProduct, available: checked})}
                />
                <Label>Available for sale</Label>
              </div>
              
              <Button onClick={handleEditProduct} className="w-full">
                Update Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}