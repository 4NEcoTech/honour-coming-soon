// 'use client';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import Image from 'next/image';
// import { useEffect, useState } from 'react';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// import Swal from 'sweetalert2';
// import { contactSchema } from '../../validation/clientSchema';

// function ContactForm() {
//   const [countries, setCountries] = useState({});
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     phoneNumber: '',
//     email: '',
//     country: '',
//     state: '',
//     city: '',
//     message: '',
//   });
//   const [logo, setLogo] = useState(null);
//   const [errors, setErrors] = useState({});

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         Swal.fire({
//           title: 'Error',
//           text: '6011_5 File size must be less than 2MB.',
//           icon: 'error',
//           confirmButtonText: 'OK',
//         });
//         return;
//       }
//       setLogo(file);
//       setFormData({ ...formData, logo: file });
//     }
//   };

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [id]: value,
//       ...(id === 'country' && { state: '', city: '' }),
//       ...(id === 'state' && { city: '' }),
//     }));
//     setErrors((prev) => ({ ...prev, [id]: undefined }));
//   };

//   const handlePhoneChange = (value) => {
//     setFormData((prev) => ({ ...prev, phoneNumber: value }));
//     setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
//   };

//   const validateForm = () => {
//     try {
//       // Only validate the form fields, not the file
//       const { logo, ...formDataWithoutLogo } = formData;
//       contactSchema.parse(formDataWithoutLogo);
//       setErrors({});
//       return true;
//     } catch (error) {
//       const newErrors = {};
//       error.errors.forEach((err) => {
//         newErrors[err.path[0]] = err.message;
//       });
//       setErrors(newErrors);
//       return false;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) {
//       Swal.fire('Error', '6011_8 correct the form errors.', 'error');
//       return;
//     }
//     try {
//       const formDataWithLogo = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         formDataWithLogo.append(key, value);
//       });

//       if (logo) {
//         formDataWithLogo.append('logo', logo);
//       }

//       const response = await fetch('/api/global/v1/gblBrBT90010Contact', {
//         method: 'POST',
//         body: formDataWithLogo,
//       });

//       const responseData = await response.json();

//       if (response.ok) {
//         Swal.fire(
//           'Success!',
//           `${responseData.message}</br>
//            We'll get back to you as soon as possible.
//           `,
//           'success'
//           // responseData.message || " We'll get back to you as soon as possible.",
//         );
//         setFormData({
//           firstName: '',
//           lastName: '',
//           phoneNumber: '',
//           email: '',
//           country: '',
//           state: '',
//           city: '',
//           message: '',
//         });
//         setLogo(null);
//       } else {
//         Swal.fire(
//           'Error',
//           responseData.message || '6011_7 Error processing the request.',
//           'error'
//         );
//         if (responseData.errors) {
//           setErrors(responseData.errors);
//         }
//       }
//     } catch (error) {
//       console.error('Form submission error', error);
//       Swal.fire('Error', ' Something went wrong. Please try again.', 'error');
//     }
//   };

//   useEffect(() => {
//     const fetchCountries = async () => {
//       try {
//         const response = await fetch('/api/gblArET90001FtchCntryDtls');
//         if (!response.ok) {
//           throw new Error('Failed to fetch countries');
//         }
//         const data = await response.json();
//         setCountries(data);
//       } catch (error) {
//         console.error('Error fetching countries:', error);
//       }
//     };

//     fetchCountries();
//   }, []);

//   useEffect(() => {
//     if (formData.country) {
//       fetch(`/api/gblArET90005FtchStateDtls?country_code=${formData.country}`)
//         .then((response) => {
//           if (!response.ok)
//             throw new Error('Failed to fetch states and cities');
//           return response.json();
//         })
//         .then((data) => {
//           setStates(data.states);
//           setCities(data.cities);
//         })
//         .catch((err) => {
//           console.error('Error fetching states and cities:', err);
//           setStates([]);
//           setCities([]);
//         });
//     } else {
//       setStates([]);
//       setCities([]);
//     }
//   }, [formData.country]);

//   return (
//     <Card className="w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto bg-transparent shadow-md rounded-lg p-6 mt-10 mb-10">
//       <CardHeader>
//         <CardTitle className="text-center text-xl font-bold">
//           Contact Us
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <Label htmlFor="firstName">
//               First Name <span className="text-destructive">*</span>
//             </Label>
//             <Input
//               id="firstName"
//               type="text"
//               placeholder="Enter your first name"
//               value={formData.firstName}
//               onChange={handleChange}
//             />
//             {errors.firstName && (
//               <p className="text-destructive text-sm mt-1">
//                 {errors.firstName}
//               </p>
//             )}
//           </div>

//           <div>
//             <Label htmlFor="lastName">Last Name</Label>
//             <Input
//               id="lastName"
//               type="text"
//               placeholder="Enter your last name"
//               value={formData.lastName}
//               onChange={handleChange}
//             />
//             {errors.lastName && (
//               <p className="text-destructive text-sm mt-1">{errors.lastName}</p>
//             )}
//           </div>

//           <div>
//             <Label htmlFor="phoneNumber">
//               Phone Number <span className="text-destructive">*</span>
//             </Label>
//             <PhoneInput
//               country={'in'}
//               value={formData.phoneNumber}
//               onChange={handlePhoneChange}
//               inputStyle={{
//                 width: '100%',
//                 height: '40px',
//                 borderRadius: '5px',
//                 border: '1px solid #ccc',
//               }}
//             />
//             {errors.phoneNumber && (
//               <p className="text-destructive text-sm mt-1">
//                 {errors.phoneNumber}
//               </p>
//             )}
//           </div>

//           <div>
//             <Label htmlFor="email">
//               Email <span className="text-destructive">*</span>
//             </Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}
//             />
//             {errors.email && (
//               <p className="text-destructive text-sm mt-1">{errors.email}</p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="country">Country</label>
//             <select
//               id="country"
//               name="country"
//               className="w-full border rounded p-2"
//               value={formData.country}
//               onChange={handleChange}>
//               <option value="">Select a country</option>
//               {Object.entries(countries).map(([key, country]) => (
//                 <option key={key} value={country.iso2}>
//                   {country.name} ({country.iso2})
//                 </option>
//               ))}
//             </select>
//             {errors.country && (
//               <p className="text-destructive text-sm mt-1">{errors.country}</p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="state">State</label>
//             <select
//               id="state"
//               name="state"
//               className="w-full border rounded p-2"
//               value={formData.state}
//               onChange={handleChange}
//               disabled={!formData.country}>
//               <option value="">Select a state</option>
//               {states.map((stateObj, index) => (
//                 <option key={index} value={stateObj.state_code}>
//                   {stateObj.name}
//                 </option>
//               ))}
//             </select>
//             {errors.state && (
//               <p className="text-destructive text-sm mt-1">{errors.state}</p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="city">City</label>
//             <select
//               id="city"
//               name="city"
//               className="w-full border rounded p-2"
//               value={formData.city}
//               onChange={handleChange}
//               disabled={!formData.state}>
//               <option value="">Select a city</option>
//               {cities.map((cityObj, index) => (
//                 <option key={index} value={cityObj.city_name}>
//                   {cityObj.city_name}
//                 </option>
//               ))}
//             </select>
//             {errors.city && (
//               <p className="text-destructive text-sm mt-1">{errors.city}</p>
//             )}
//           </div>

//           <div>
//             <Label htmlFor="message">
//               Message <span className="text-destructive">*</span>
//             </Label>
//             <textarea
//               id="message"
//               placeholder="Type your message"
//               className="w-full border rounded p-2 h-24"
//               value={formData.message}
//               onChange={handleChange}></textarea>
//             {errors.message && (
//               <p className="text-destructive text-sm mt-1">{errors.message}</p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="logo" className="block text-sm font-medium">
//               Attach Screenshot
//             </Label>
//             <div
//               className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer text-center"
//               onClick={() => document.getElementById('logo').click()}>
//               <Image
//                 src="/image/info/upload.svg"
//                 alt="Upload Icon"
//                 width={32}
//                 height={32}
//                 className="mx-auto mb-2 w-8 h-8"
//               />
//               <p className="text-gray-600">
//                 <span className="text-blue-600">Click to upload</span> or drag
//                 and drop
//               </p>
//               <p className="text-gray-400 text-xs mt-1">
//                 JPG, JPEG, PNG Less than 2MB
//               </p>
//             </div>
//             <input
//               type="file"
//               id="logo"
//               name="logo"
//               accept=".jpg,.jpeg,.png"
//               onChange={handleFileChange}
//               className="hidden"
//             />
//             {logo && (
//               <p className="text-green-600 mt-2">File uploaded: {logo.name}</p>
//             )}
//           </div>

//           <div className="text-center">
//             <Button
//               type="submit"
//               className="w-full bg-primary text-white rounded">
//               Submit
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//       {/* <CardFooter className="flex flex-col items-center">
//         <p className="text-center text-gray-600 mb-4">
//           We&apos;ll get back to you as soon as possible.
//         </p>
//         <div className="text-sm text-gray-500 flex flex-row gap-2"></div>
//       </CardFooter> */}
//     </Card>
//   );
// }

// export default ContactForm;

'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Swal from 'sweetalert2';
import { contactSchema } from '../../../validation/clientSchema';

function ContactForm() {
  const [countries, setCountries] = useState({});
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    country: '',
    state: '',
    city: '',
    message: '',
  });
  const [logo, setLogo] = useState(null);
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          title: 'Error',
          text: '6011_5 File size must be less than 2MB.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        return;
      }
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          title: 'Error',
          text: 'Only PNG, JPG, and JPEG files are allowed.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        return;
      }
      setLogo(file);
      setFormData({ ...formData, logo: file });
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
      ...(id === 'country' && { state: '', city: '' }),
      ...(id === 'state' && { city: '' }),
    }));
    setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value }));
    setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
  };

  const validateForm = () => {
    try {
      // Only validate the form fields, not the file
      const { logo, ...formDataWithoutLogo } = formData;
      contactSchema.parse(formDataWithoutLogo);
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire('Error', '6011_8 correct the form errors.', 'error');
      return;
    }
    try {
      const formDataWithLogo = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataWithLogo.append(key, value);
      });

      if (logo) {
        formDataWithLogo.append('logo', logo);
      }

      const response = await fetch('/api/global/v1/gblBrBT90010Contact', {
        method: 'POST',
        body: formDataWithLogo,
      });

      const responseData = await response.json();

      if (response.ok) {
        Swal.fire(
          'Success!',
          `${responseData.message}</br>
         We'll get back to you as soon as possible.
        `,
          'success'
        );
        setFormData({
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          country: '',
          state: '',
          city: '',
          message: '',
        });
        setLogo(null);
      } else {
        Swal.fire(
          'Error',
          responseData.message || '6011_7 Error processing the request.',
          'error'
        );
        if (responseData.errors) {
          setErrors(responseData.errors);
        }
      }
    } catch (error) {
      console.error('Form submission error', error);
      Swal.fire('Error', ' Something went wrong. Please try again.', 'error');
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          '/api/global/v1/gblArET90001FtchCntryDtls'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (formData.country) {
      fetch(
        `/api/global/v1/gblArET90005FtchStateDtls?country_code=${formData.country}`
      )
        .then((response) => {
          if (!response.ok)
            throw new Error('Failed to fetch states and cities');
          return response.json();
        })
        .then((data) => {
          setStates(data.states);
          setCities(data.cities);
        })
        .catch((err) => {
          console.error('Error fetching states and cities:', err);
          setStates([]);
          setCities([]);
        });
    } else {
      setStates([]);
      setCities([]);
    }
  }, [formData.country]);

  return (
    <Card className="w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto bg-transparent shadow-md rounded-lg p-6 mt-10 mb-10 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold dark:text-gray-100">
          Contact Us
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="firstName"
              className="text-gray-700 dark:text-gray-300">
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
            {errors.firstName && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="lastName"
              className="text-gray-700 dark:text-gray-300">
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />
            {errors.lastName && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.lastName}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="phoneNumber"
              className="text-gray-700 dark:text-gray-300">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <PhoneInput
              country={'in'}
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              inputStyle={{
                width: '100%',
                height: '40px',
                borderRadius: 'var(--radius)',
                backgroundColor: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--input))',
              }}
              buttonStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--input))',
              }}
              dropdownStyle={{
                backgroundColor: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
              }}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.phoneNumber}
              </p>
            )}
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
            {errors.email && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="country"
              className="text-gray-700 dark:text-gray-300">
              Country
            </label>
            <select
              id="country"
              name="country"
              className="mt-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 rounded p-2"
              value={formData.country}
              onChange={handleChange}>
              <option value="">Select a country</option>
              {Object.entries(countries).map(([key, country]) => (
                <option key={key} value={country.iso2}>
                  {country.name} ({country.iso2})
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.country}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="text-gray-700 dark:text-gray-300">
              State
            </label>
            <select
              id="state"
              name="state"
              className="mt-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 rounded p-2"
              value={formData.state}
              onChange={handleChange}
              disabled={!formData.country}>
              <option value="">Select a state</option>
              {states.map((stateObj, index) => (
                <option key={index} value={stateObj.state_code}>
                  {stateObj.name}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.state}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="city" className="text-gray-700 dark:text-gray-300">
              City
            </label>
            <select
              id="city"
              name="city"
              className="mt-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 rounded p-2"
              value={formData.city}
              onChange={handleChange}
              disabled={!formData.state}>
              <option value="">Select a city</option>
              {cities.map((cityObj, index) => (
                <option key={index} value={cityObj.city_name}>
                  {cityObj.city_name}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.city}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="message"
              className="text-gray-700 dark:text-gray-300">
              Message <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="message"
              placeholder="Type your message"
              className="mt-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 rounded p-2 h-24"
              value={formData.message}
              onChange={handleChange}></textarea>
            {errors.message && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="logo"
              className="block text-sm font-medium dark:text-gray-300 text-gray-700">
              Attach Logo
            </Label>
            <div
              className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer text-center dark:border-gray-600"
              onClick={() => document.getElementById('logo').click()}>
              <Image
                src="/image/info/upload.svg"
                alt="Upload Icon"
                width={32}
                height={32}
                className="mx-auto mb-2 w-8 h-8"
              />
              <p className="text-gray-600 dark:text-gray-400">
                <span className="text-primary dark:text-[hsl(206,_100%,_30%)]">
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                PNG, JPG, JPEG (max. 2MB)
              </p>
            </div>
            <input
              type="file"
              id="logo"
              name="logo"
              accept=".png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="hidden"
            />
            {logo && (
              <p className="text-green-600 mt-2 dark:text-green-400">
                File uploaded: {logo.name}
              </p>
            )}
          </div>

          <div className="text-center">
            <Button
              type="submit"
              className="w-full bg-primary text-white rounded hover:bg-primary-dark">
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
      {/* <CardFooter className="flex flex-col items-center">
        <p className="text-center text-gray-600 mb-4">
          We&apos;ll get back to you as soon as possible.
        </p>
        <div className="text-sm text-gray-500 flex flex-row gap-2"></div>
      </CardFooter> */}
    </Card>
  );
}

export default ContactForm;
