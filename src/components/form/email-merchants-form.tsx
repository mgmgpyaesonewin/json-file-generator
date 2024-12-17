import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { emailMerchant } from "@/app/actions/payoutActions"

export function EmailMerchantsForm() {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const merchant = formData.get("merchant") as string;
        console.log({ email, merchant });

        // Call emailMerchant Server Action
        await emailMerchant('pyae@evp-pay.com', 'AMTK');
        setIsOpen(false);
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogTrigger asChild>
                <Button onClick={handleOpen}>Email Merchants</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <form onSubmit={handleSubmit}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Email Merchants</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="flex flex-col gap-6 my-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Enter Merchant Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="merchant">Choose Merchant</Label>
                            <Select>
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
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 py-4">
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction type="submit">Send</AlertDialogAction>
                        </AlertDialogFooter>
                    </div>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    )
}