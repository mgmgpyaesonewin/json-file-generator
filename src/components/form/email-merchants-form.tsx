import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { emailMerchant } from "@/app/actions/payoutActions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const emailMerchantsFormSchema = z.object({
  email: z.string().email(),
  merchant: z.string(),
  password: z.string(),
});

type EmailMerchantsFormProps = {
  files: string[];
};

export function EmailMerchantsForm({ files }: EmailMerchantsFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof emailMerchantsFormSchema>>({
    resolver: zodResolver(emailMerchantsFormSchema),
    defaultValues: {
      email: "",
      merchant: "",
      password: "",
    },
  });

  const handleOpen = () => setIsOpen(true);

  async function handleSubmit(data: z.infer<typeof emailMerchantsFormSchema>) {
    setIsOpen(false);
    toast('Sending email...', { type: 'info' });

    const attachment = files.find((file) => file.includes(form.getValues("merchant")))

    // Call emailMerchant Server Action
    const result = await emailMerchant(data.email, data.merchant, attachment, data.password);

    if (result.status === "success") {
      toast("Email sent successfully", {
        type: "success",
      });
    } else {
      toast("Error sending email", {
        type: "error",
      });
    }
  }

  function handleReset() {
    form.reset();
    setIsOpen(false);
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button onClick={handleOpen}>Email Merchants</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} onReset={handleReset}>
            <AlertDialogHeader>
              <AlertDialogTitle>Email Merchants</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="flex flex-col gap-6 my-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="merchant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="merchant">Merchant</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Merchant" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AMTK">AMTK</SelectItem>
                          <SelectItem value="AWIN">AWIN</SelectItem>
                          <SelectItem value="DGDO">DGDO</SelectItem>
                          <SelectItem value="MICR">MICR</SelectItem>
                          <SelectItem value="SAPP">SAPP</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-4 py-4">
              <AlertDialogFooter>
                <AlertDialogCancel type="reset">Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit">Send</AlertDialogAction>
              </AlertDialogFooter>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
