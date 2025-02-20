import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { authService } from '@/services/auth';
import { useAuth } from '@/hooks/useAuth';

const phoneSchema = z.object({
  phone: z.string().min(10).max(10),
});

const otpSchema = z.object({
  otp: z.string().length(6),
});

export function PhoneLogin() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [timer, setTimer] = useState(120);
  const [isResendActive, setIsResendActive] = useState(false);
  const { loginWithOtp } = useAuth();
  
  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsResendActive(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const onPhoneSubmit = async (data: z.infer<typeof phoneSchema>) => {
    try {
      const response = await authService.generateOtp(data.phone);
      if (response.status) {
        setStep('otp');
        setTimer(120);
        setIsResendActive(false);
      }
    } catch (error) {
      console.error('Failed to send OTP:', error);
    }
  };

  const onOtpSubmit = async (data: z.infer<typeof otpSchema>) => {
    const phone = phoneForm.getValues('phone');
    await loginWithOtp(phone, data.otp);
  };

  const handleResendOtp = async () => {
    if (isResendActive) {
      const phone = phoneForm.getValues('phone');
      await authService.generateOtp(phone);
      setTimer(120);
      setIsResendActive(false);
    }
  };

  return (
    <div className="space-y-6">
      {step === 'phone' ? (
        <Form {...phoneForm}>
          <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
            <FormField
              control={phoneForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full"
              disabled={phoneForm.formState.isSubmitting}
            >
              {phoneForm.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send OTP
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter OTP</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter 6-digit OTP" maxLength={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-sm text-center">
              {timer > 0 ? (
                <p>Resend OTP in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
              ) : (
                <Button
                  variant="link"
                  onClick={handleResendOtp}
                  disabled={!isResendActive}
                  className="p-0 h-auto"
                >
                  Resend OTP
                </Button>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={otpForm.formState.isSubmitting}
            >
              {otpForm.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Verify OTP
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}