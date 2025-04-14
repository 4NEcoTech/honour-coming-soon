"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useEffect, useState } from "react"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import Swal from "sweetalert2"
import { contactSchema } from "../../../validation/clientSchema"
import { Textarea } from "@/components/ui/textarea"

function ContactForm() {
  const [countries, setCountries] = useState({})
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    country: "IN", // Default to India
    pincode: "",
    state: "",
    city: "",
    message: "",
  })
  const [logo, setLogo] = useState(null)
  const [errors, setErrors] = useState({})

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          title: "Error",
          text: "6011_5 File size must be less than 2MB.",
          icon: "error",
          confirmButtonText: "OK",
        })
        return
      }
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"]
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          title: "Error",
          text: "Only PNG, JPG, and JPEG files are allowed.",
          icon: "error",
          confirmButtonText: "OK",
        })
        return
      }
      setLogo(file)
      setFormData({ ...formData, logo: file })
    }
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
    setErrors((prev) => ({ ...prev, [id]: undefined }))
  }

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value }))
    setErrors((prev) => ({ ...prev, phoneNumber: undefined }))
  }

  const validateForm = () => {
    try {
      // Only validate the form fields, not the file
      const { logo, ...formDataWithoutLogo } = formData
      contactSchema.parse(formDataWithoutLogo)
      setErrors({})
      return true
    } catch (error) {
      const newErrors = {}
      error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message
      })
      setErrors(newErrors)
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      Swal.fire("Error", "6011_8 correct the form errors.", "error")
      return
    }
    try {
      const formDataWithLogo = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataWithLogo.append(key, value)
      })

      if (logo) {
        formDataWithLogo.append("logo", logo)
      }

      const response = await fetch("/api/global/v1/gblBrBT90010Contact", {
        method: "POST",
        body: formDataWithLogo,
      })

      const responseData = await response.json()

      if (response.ok) {
        Swal.fire(
          "Success!",
          `${responseData.message}</br>
         We'll get back to you as soon as possible.
        `,
          "success",
        )
        setFormData({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          email: "",
          country: "IN",
          pincode: "",
          state: "",
          city: "",
          message: "",
        })
        setLogo(null)
      } else {
        Swal.fire("Error", responseData.message || "6011_7 Error processing the request.", "error")
        if (responseData.errors) {
          setErrors(responseData.errors)
        }
      }
    } catch (error) {
      console.error("Form submission error", error)
      Swal.fire("Error", " Something went wrong. Please try again.", "error")
    }
  }

  const fetchAddressFromPincode = async (pincode) => {
    try {
      const response = await fetch(`/api/global/v1/gblArET90003FtchPinCdDtls?pincode=${pincode}`)
      const data = await response.json()

      if (data?.data?.state && data?.data?.city) {
        setFormData((prev) => ({
          ...prev,
          state: data.data.state,
          city: data.data.city,
        }))
      } else {
        console.error("Invalid pincode or no data returned")
      }
    } catch (err) {
      console.error("Error fetching address details:", err)
    }
  }

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/global/v1/gblArET90001FtchCntryDtls")
        if (!response.ok) {
          throw new Error("Failed to fetch countries")
        }
        const data = await response.json()
        setCountries(data)
      } catch (error) {
        console.error("Error fetching countries:", error)
      }
    }

    fetchCountries()
  }, [])

  return (
    <Card className="w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto bg-transparent shadow-md rounded-lg p-6 mt-10 mb-10 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold dark:text-gray-100">Contact Us</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">
              First Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />
            {errors.firstName && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">
              Last Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />
            {errors.lastName && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <Label htmlFor="phoneNumber" className="text-gray-700 dark:text-gray-300">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <PhoneInput
              country={"in"}
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              inputStyle={{
                width: "100%",
                height: "40px",
                borderRadius: "var(--radius)",
                backgroundColor: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--input))",
              }}
              buttonStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--input))",
              }}
              dropdownStyle={{
                backgroundColor: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
              }}
            />
            {errors.phoneNumber && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />
            {errors.email && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="country" className="text-gray-700 dark:text-gray-300">
              Country
            </Label>
            <Select value={formData.country} onValueChange={(value) => handleSelectChange("country", value)}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(countries).map(([key, country]) => (
                  <SelectItem key={key} value={country.iso2}>
                    {country.name} ({country.iso2})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.country}</p>}
          </div>

          <div>
            <Label htmlFor="pincode" className="text-gray-700 dark:text-gray-300">
              Pincode
            </Label>
            <Input
              id="pincode"
              type="text"
              placeholder="Enter your pincode"
              value={formData.pincode || ""}
              onChange={(e) => {
                const value = e.target.value
                handleChange(e)
                if (value.length === 6) {
                  fetchAddressFromPincode(value)
                }
              }}
              maxLength={6}
              className="mt-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />
            {errors.pincode && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.pincode}</p>}
          </div>

          <div>
            <Label htmlFor="state" className="text-gray-700 dark:text-gray-300">
              State
            </Label>
            <Input
              id="state"
              type="text"
              placeholder="State (Auto-filled from pincode)"
              value={formData.state}
              onChange={handleChange}
              className="mt-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />
            {errors.state && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.state}</p>}
          </div>

          <div>
            <Label htmlFor="city" className="text-gray-700 dark:text-gray-300">
              City
            </Label>
            <Input
              id="city"
              type="text"
              placeholder="City (Auto-filled from pincode)"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />
            {errors.city && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.city}</p>}
          </div>

          <div>
            <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">
              Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Type your message"
              className="mt-1 w-full min-h-[100px]"
              value={formData.message}
              onChange={handleChange}
            />
            {errors.message && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.message}</p>}
          </div>
          {status === "authenticated" && (
            <div className="space-y-2">
              <Label htmlFor="logo" className="block text-sm font-medium dark:text-gray-300 text-gray-700">
                Attach Screenshot
              </Label>
              <div
                className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer text-center dark:border-gray-600"
                onClick={() => document.getElementById("logo").click()}
              >
                <Image
                  src="/image/info/upload.svg"
                  alt="Upload Icon"
                  width={32}
                  height={32}
                  className="mx-auto mb-2 w-8 h-8"
                />
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="text-primary dark:text-[hsl(206,_100%,_30%)]">Click to upload</span> or drag and drop
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">PNG, JPG, JPEG (max. 2MB)</p>
              </div>
              <input
                type="file"
                id="logo"
                name="logo"
                accept=".png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              {logo && <p className="text-green-600 mt-2 dark:text-green-400">File uploaded: {logo.name}</p>}
            </div>
          )}
          <div className="text-center">
            <Button type="submit" className="w-full bg-primary text-white rounded hover:bg-primary-dark">
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ContactForm
