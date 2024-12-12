"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import { toast } from "react-toastify";
import { PayoutFormSchema } from "@/schemas/payoutSchema"
import {
  copyFolder,
  downloadFiles,
  executeDbScripts,
  uploadOutputFiles
} from "@/app/actions/payoutActions";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import PayoutStep from "@/components/PayoutStep";
import { PayoutStepResult } from "@/types"

export function PayoutForm() {
  const form = useForm<z.infer<typeof PayoutFormSchema>>({
    resolver: zodResolver(PayoutFormSchema),
  })

  const [payoutProgress, setPayOutProgress] = useState<PayoutStepResult[]>([]);

  async function onSubmit(data: z.infer<typeof PayoutFormSchema>) {
    try {
      const trxnDate = format(data.dob, "yyyy-MM-dd");
      toast(`You submitted the following values:${trxnDate}`, { type: 'info' });

      const copyFolderResult = await copyFolder(trxnDate);
      setPayOutProgress([copyFolderResult]);

      const downloadFilesResult = await downloadFiles(trxnDate);
      setPayOutProgress([copyFolderResult, downloadFilesResult]);

      const executeDbScriptsResult = await executeDbScripts(trxnDate);
      setPayOutProgress([copyFolderResult, downloadFilesResult, executeDbScriptsResult]);

      const uploadOutputFilesResult = await uploadOutputFiles(trxnDate);
      setPayOutProgress([copyFolderResult, downloadFilesResult, executeDbScriptsResult, uploadOutputFilesResult]);

      if (uploadOutputFilesResult.status === "success") {
        toast("Payout process completed successfully", { type: 'success' });
      } else {
        toast("Payout process failed", { type: 'error' });
      }

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Card className="pt-8 drop-shadow-md">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Transactions</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Your date is to calculate payout transactions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="mt-8">
        <PayoutStep steps={payoutProgress} />
      </div>
    </>
  )
}
