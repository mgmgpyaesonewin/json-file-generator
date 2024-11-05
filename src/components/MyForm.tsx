"use client";

import { z } from 'zod';

import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import JsonPreview from './JsonPreview';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {Select, SelectItem, SelectTrigger, SelectValue, SelectContent, SelectLabel, SelectGroup} from './ui/select';
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {PulseLoader} from "react-spinners";

const FormSchema = z.object({
    templateFile: z.enum([
        'config_EVPSTORE_only_KSher.json',
        'config_EVPSTORE_onlyTTB.json',
        'config_EVPSTORE_TTBcard_KSher.json',
        'config_EVPSTORE_TTBcard_TTBPromptPay.json',
        'config_EVPSTORE_TTBcard_TTBpromptPay_KSher.json'
    ]).default('config_EVPSTORE_only_KSher.json'),
    deviceSettingsOfBottomInfoLine1: z.string().min(3, {
        message: 'TID must be at least 3 characters long',
    }),
    deviceSettingsOfBottomInfoLine2: z.string().min(7, {
        message: 'Phone Number must be at least 7 characters long',
    }),
    deviceSettingsOfEnableUserManagement: z.enum(['true', 'false']).default('false'),
    linkPOSConfigOfToggle: z.enum(['on', 'off']).default('off'),
    appThemeOfTransLogging: z.enum(['on', 'off']).default('off')
});

const MyForm: React.FC = () => {
    // Form Loading State
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            templateFile: 'config_EVPSTORE_only_KSher.json',
            deviceSettingsOfBottomInfoLine1: '',
            deviceSettingsOfBottomInfoLine2: '',
            deviceSettingsOfEnableUserManagement: 'false',
            linkPOSConfigOfToggle: 'off',
            appThemeOfTransLogging: 'off'
        },
    });

    const [generatedConfig, setGeneratedConfig] = useState(null);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            // Set loading state to true
            setLoading(true);
            setGeneratedConfig(null);

            const raw = await fetch('/api/generate-config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!raw.ok) {
                const errorResponse = await raw.json();
                alert(errorResponse.message);
                return;
            }

            const response = await raw.json();
            if (raw.ok) {
                setGeneratedConfig(response.updatedConfig); // Display the updated JSON config for preview
            } else {
                alert(response.message);
            }
        } catch (error) {
            alert('Error generating config');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-between">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 mr-5">
                <h2 className="text-2xl font-semibold mt-4 mb-2">Template File</h2>
                    <FormField
                        control={form.control}
                        name="templateFile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor={field.name}>Select Template File</FormLabel>
                                <Select
                                    onValueChange={(value) => form.setValue(
                                        'templateFile',
                                        value as z.infer<typeof FormSchema>['templateFile']
                                    )}
                                    value={form.getValues('templateFile')}>
                                    <FormControl>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder="Select a template file" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Only KSher</SelectLabel>
                                            <SelectItem value="config_EVPSTORE_only_KSher.json">EVP Store (Only KSher)</SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>Only TTB Card</SelectLabel>
                                            <SelectItem value="config_EVPSTORE_onlyTTB.json">EVP Store (Only TTB Card)</SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>TTB Card and KSher</SelectLabel>
                                            <SelectItem value="config_EVPSTORE_TTBcard_KSher.json">EVP Store ( TTB Card and KSher )</SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>TTB Card and TTB Prompt Pay</SelectLabel>
                                            <SelectItem value="config_EVPSTORE_TTBcard_TTBPromptPay.json">EVP Store ( TTB Card and TTB Prompt Pay )</SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>TTB Card, TTB Prompt Pay and KSher</SelectLabel>
                                            <SelectItem value="config_EVPSTORE_TTBcard_TTBpromptPay_KSher.json">EVP Store (TTB Card, TTB Prompt Pay and KSher)</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <hr className="my-6" />
                    <h2 className="text-2xl font-semibold my-4">Device Setting</h2>
                    <div className="flex flex-col space-y-4">
                        <FormField
                            control={form.control}
                            name="deviceSettingsOfBottomInfoLine1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor={field.name}>TID ( deviceSettings {'>'} bottomInfoLine1 ) </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage>
                                        {form.formState.errors.deviceSettingsOfBottomInfoLine1?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deviceSettingsOfBottomInfoLine2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor={field.name}>Phone Number ( Device Settings of Bottom Info Line 2 )</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage>
                                        {form.formState.errors.deviceSettingsOfBottomInfoLine2?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deviceSettingsOfEnableUserManagement"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel htmlFor={field.name}>Enable User Management ( deviceSettings {'>'} enableUserManagement )</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="true" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    true
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="false" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    false
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="linkPOSConfigOfToggle"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel htmlFor={field.name}>Link POS Configuration Toggle ( linkPOSConfig {'>'} toggle )</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">

                                                <FormControl>
                                                    <RadioGroupItem value="on" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    on
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="off" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    off
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="appThemeOfTransLogging"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel htmlFor={field.name}>App Theme of Transaction Logging ( appTheme {'>'} transLogging )</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="on" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    on
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="off" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    off
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="mt-4 relative" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="opacity-0">Generate Config</span> {/* Invisible placeholder to keep size */}
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <PulseLoader color="#fff" size={10} />
                                        <span className="ml-2">Generating Config</span>
                                    </span>
                                </>
                            ) : (
                                <span>Generate Config</span>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
            <JsonPreview data={generatedConfig}/>
        </div>
    );
};

export default MyForm;