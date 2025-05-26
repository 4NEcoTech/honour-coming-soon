"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Edit, Save, Plus, Download, Upload, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ConfigParamsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState("all")
  const [editingParam, setEditingParam] = useState(null)
  const [params, setParams] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true)
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      setParams([
        {
          id: 1,
          name: "OTP Timer",
          value: "20",
          level: "Product Suite Level",
          loadInfo: "N/A",
          loadAdditionalInfo: "N/A",
          editableBy: "Super Admin",
          description: "For the Product suite...",
          product: "HCJ",
          language: "English",
          systemName: "GBL.0033_ForgetPassword",
          apiName: "GBL.0033_ForgetPassword...",
        },
        {
          id: 2,
          name: "Password Length",
          value: "20",
          level: "Product Suite Level",
          loadInfo: "N/A",
          loadAdditionalInfo: "N/A",
          editableBy: "Super Admin",
          description: "minimum 12 char",
          product: "HCJ",
          language: "English",
          systemName: "GBL.0033_ForgetPassword",
          apiName: "GBL.0033_ForgetPassword...",
        },
        {
          id: 3,
          name: "Small Logics",
          value: "LinkedIn",
          level: "Product Level",
          loadInfo: "HCJ",
          loadAdditionalInfo: "N/A",
          editableBy: "Super Admin",
          description: "This defines which social...",
          product: "HCJ",
          language: "English",
          systemName: "GBL.0033_ForgetPassword",
          apiName: "GBL.0033_ForgetPassword...",
        },
        {
          id: 4,
          name: "Profile Visibility",
          value: "Public/Private",
          level: "User Level",
          loadInfo: "All",
          loadAdditionalInfo: "N/A",
          editableBy: "Super Admin",
          description: "Users visibility to connected...",
          product: "HCJ",
          language: "English",
          systemName: "GBL.0033_ForgetPassword",
          apiName: "GBL.0033_ForgetPassword...",
        },
        // Add more profile timeout entries
        ...Array.from({ length: 16 }, (_, i) => ({
          id: i + 5,
          name: "Profile Timeout",
          value: "4",
          level: "User Level",
          loadInfo: i < 3 ? "HCJ" : "TeeNow",
          loadAdditionalInfo: "N/A",
          editableBy: "Super Admin",
          description: "Menu | 1 implies never logout",
          product: "HCJ",
          language: "English",
          systemName: "GBL.0033_ForgetPassword",
          apiName: "GBL.0033_ForgetPassword...",
        })),
      ])
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter parameters based on search term and filter
  const filteredParams = params.filter((param) => {
    const matchesSearch =
      param.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      param.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      param.systemName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterLevel === "all" || param.level === filterLevel

    return matchesSearch && matchesFilter
  })

  // Handle editing a parameter
  const handleEdit = (param) => {
    setEditingParam({ ...param })
  }

  // Handle saving edited parameter
  const handleSave = () => {
    if (editingParam) {
      setParams(params.map((p) => (p.id === editingParam.id ? editingParam : p)))
      setEditingParam(null)
    }
  }

  // Get unique parameter levels for filter
  const paramLevels = ["all", ...new Set(params.map((param) => param.level))]

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Configuration Parameters</CardTitle>
              <CardDescription className="text-blue-100 mt-1">Manage and configure system parameters</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <TabsList className="mb-4 md:mb-0">
                <TabsTrigger value="all">All Parameters</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="product">Product</TabsTrigger>
                <TabsTrigger value="user">User</TabsTrigger>
              </TabsList>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search parameters..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by level" />
                    </SelectTrigger>
                    <SelectContent>
                      {paramLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level === "all" ? "All Levels" : level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Parameter
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Parameter</DialogTitle>
                      <DialogDescription>Create a new configuration parameter for the system.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input id="name" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="value" className="text-right">
                          Value
                        </Label>
                        <Input id="value" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="level" className="text-right">
                          Level
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="product-suite">Product Suite Level</SelectItem>
                            <SelectItem value="product">Product Level</SelectItem>
                            <SelectItem value="user">User Level</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Parameter</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-100">
                      <TableRow>
                        <TableHead className="w-12 text-center">#</TableHead>
                        <TableHead>Parameter Name</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Load Info</TableHead>
                        <TableHead>Editable By</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell colSpan={9} className="h-12">
                              <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : filteredParams.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="h-24 text-center">
                            No parameters found matching your criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredParams.map((param) => (
                          <TableRow key={param.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium text-center">{param.id}</TableCell>
                            <TableCell>{param.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono">
                                {param.value}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={`
                                  ${param.level.includes("Product Suite") ? "bg-purple-100 text-purple-800" : ""}
                                  ${param.level.includes("Product Level") ? "bg-blue-100 text-blue-800" : ""}
                                  ${param.level.includes("User Level") ? "bg-green-100 text-green-800" : ""}
                                `}
                              >
                                {param.level}
                              </Badge>
                            </TableCell>
                            <TableCell>{param.loadInfo}</TableCell>
                            <TableCell>{param.editableBy}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger className="flex items-center">
                                    {param.description}
                                    <Info className="ml-1 h-3 w-3 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-80">{param.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>{param.product}</TableCell>
                            <TableCell className="text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(param)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Parameter</DialogTitle>
                                    <DialogDescription>Make changes to the parameter configuration.</DialogDescription>
                                  </DialogHeader>
                                  {editingParam && (
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-name" className="text-right">
                                          Name
                                        </Label>
                                        <Input
                                          id="edit-name"
                                          value={editingParam.name}
                                          onChange={(e) => setEditingParam({ ...editingParam, name: e.target.value })}
                                          className="col-span-3"
                                        />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-value" className="text-right">
                                          Value
                                        </Label>
                                        <Input
                                          id="edit-value"
                                          value={editingParam.value}
                                          onChange={(e) => setEditingParam({ ...editingParam, value: e.target.value })}
                                          className="col-span-3"
                                        />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-description" className="text-right">
                                          Description
                                        </Label>
                                        <Input
                                          id="edit-description"
                                          value={editingParam.description}
                                          onChange={(e) =>
                                            setEditingParam({ ...editingParam, description: e.target.value })
                                          }
                                          className="col-span-3"
                                        />
                                      </div>
                                    </div>
                                  )}
                                  <DialogFooter>
                                    <Button onClick={handleSave}>
                                      <Save className="mr-2 h-4 w-4" />
                                      Save Changes
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                Showing {filteredParams.length} of {params.length} parameters
              </div>
            </TabsContent>

            {/* Other tab contents would be similar but with filtered data */}
            <TabsContent value="system" className="mt-0">
              <div className="rounded-md border p-8 text-center">
                <h3 className="text-lg font-medium">System Parameters</h3>
                <p className="text-gray-500 mt-2">System-wide configuration parameters will be displayed here.</p>
              </div>
            </TabsContent>

            <TabsContent value="product" className="mt-0">
              <div className="rounded-md border p-8 text-center">
                <h3 className="text-lg font-medium">Product Parameters</h3>
                <p className="text-gray-500 mt-2">Product-specific configuration parameters will be displayed here.</p>
              </div>
            </TabsContent>

            <TabsContent value="user" className="mt-0">
              <div className="rounded-md border p-8 text-center">
                <h3 className="text-lg font-medium">User Parameters</h3>
                <p className="text-gray-500 mt-2">User-level configuration parameters will be displayed here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
