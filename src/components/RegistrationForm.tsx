'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTicketStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from "next/image";
import { useCallback, useState, useRef } from "react";
import { motion } from 'framer-motion';
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  request: z.string().min(5, 'Request must be at least 5 characters'),
});

export const RegistrationForm = () => {
  const { formData, setFormData, nextStep, prevStep } = useTicketStore();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setIsUploading(true);
      setUploadError(null);

      // Validate file
      const MAX_SIZE = 2 * 1024 * 1024; // 2MB
      const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error('Only JPG, PNG, and GIF images are allowed');
      }

      if (file.size > MAX_SIZE) {
        throw new Error('File size must be less than 2MB');
      }

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      return data.secure_url;

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Image upload failed');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleFileInput = useCallback(async (files: FileList | null) => {
    if (!files?.[0]) return;

    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewImage(reader.result);
      }
    };
    reader.readAsDataURL(file);

    const imageUrl = await handleImageUpload(file);
    if (imageUrl) setPreviewImage(imageUrl);
  }, [handleImageUpload]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!previewImage) {
      setUploadError('Please upload a profile photo');
      return;
    }
    
    setFormData({ 
      ...values, 
      avatar: previewImage 
    });
    nextStep();
  };

  const dropIn = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  };
  

  return (
<motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="main_card"
    >

<motion.div
        variants={dropIn}
        initial="hidden"
        animate="visible"
        className=""
      >
  <Card className="reg_card2">
            <CardHeader>
          <CardTitle className="cardtitle1">
            <h1 className="h1">Attendee Details</h1>
            <span className="span1">Step 2/3</span>
          </CardTitle>
          <div className="progress">
            <div
              className="progress_bar"
              style={{ width: '66%' }}
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6 p-5 body_card">
           a
            <div className="p-4 border border-[#0E464F]  bg-[#052228]   rounded-xl ">
              <label className="text-white text-sm ">Upload Profile Photo</label>
              <div className='bg-[#02191D] h-[135px] mt-12 '></div>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-teal-600');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-teal-600');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-teal-600');
                  handleFileInput(e.dataTransfer.files);
                }}
                className={`group relative bg-[#0E464F] -mt-40  mx-auto h-40 md:w-1/2  md:h-48 flex flex-col items-center justify-center border-4 rounded-3xl cursor-pointer transition-all
                  ${previewImage ? 'border-[#24A0B5]' : 'border-teal-400 hover:border-teal-500'}
                  ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-fill rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center p-4 text-center">
                    <Image
                      src="/icons/upload.svg"
                      width={32}
                      height={32}
                      alt="Upload"
                      className="mb-2 opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG, GIF (max 2MB)
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileInput(e.target.files)}
                  disabled={isUploading}
                />
              </div>
                
              {uploadError && (
                <p className="text-red-400 text-sm">{uploadError}</p>
              )}
              {isUploading && (
                <p className="text-teal-400 text-sm">Uploading...</p>
              )}
            </div>

            {/* Form Fields */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Enter your name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-[#07373F] border-[#0E464F] text-white focus:ring-teal-500"
                          placeholder="John Doe"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Enter your email *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className="bg-[#07373F] border-[#0E464F] text-white focus:ring-teal-500"
                          placeholder="📧 hello@avioflagos.io"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="request"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Special Requests</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="bg-[#07373F] border-[#0E464F] text-white focus:ring-teal-500 min-h-[120px]"
                          placeholder="Textarea"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Navigation Buttons */}
                <div className="flex flex-col md:flex-row gap-4 mt-8">
                  <Button
                    type="button"
                    onClick={prevStep}
                    className="w-full md:w-1/2 border border-[#24A0B5] bg-transparent text-[#24A0B5] hover:bg-[#24A0B5]/10"
                    disabled={isUploading}
                  >
                    Back
                  </Button>
                  <Button
  type="submit"
  className="w-full md:w-1/2 bg-[#24A0B5] hover:bg-[#1c7e8f] text-white"
  disabled={isUploading}
>
  {isUploading ? (
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      Uploading...
    </div>
  ) : (
    'Get My Free Ticket'
  )}
</Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
      </motion.div>
      </motion.section>
        );
};