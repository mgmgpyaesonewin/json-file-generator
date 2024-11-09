"use client";

import { z } from 'zod';

import React, {useEffect, useState} from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import JsonPreview from '../JsonPreview';
import {useFieldArray, useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {Select, SelectItem, SelectTrigger, SelectValue, SelectContent, SelectLabel, SelectGroup} from '@/components/ui/select';
import {PulseLoader} from "react-spinners";
import acquirerSchema from "@/schemas/acquirerSchema";
import issuerSchema from "@/schemas/issuerSchema";
import {toast} from "react-toastify";
import capkSchema from "@/schemas/capkSchema";

const FormSchema =  z.object({
    templateFile: z.enum([
        'config_EVP_onlyTTB.json',
        'config_EVP_TTB_Card_PromptPay.json',
        'config_EVP_TTB_OnlyCard.json',
        'config_EVP_TTB_TTBCard_TTBPromptPay_KSher.json'
    ]).default('config_EVP_onlyTTB.json'),
    translationOfLabelHeaderLine1En: z.string().min(7, {
        message: 'Header Line 1 must be at least 7 characters long',
    }),
    translationOfLabelHeaderLine1Th: z.string().min(7, {
        message: 'Header Line 1 must be at least 7 characters long',
    }),
    translationOfLabelHeaderLine2En: z.string().min(7, {
        message: 'Header Line 2 must be at least 7 characters long',
    }),
    translationOfLabelHeaderLine2Th: z.string().min(7, {
        message: 'Header Line 2 must be at least 7 characters long',
    }),
    translationOfLabelHeaderLine3En: z.string().min(7, {
        message: 'Header Line 3 must be at least 7 characters long',
    }),
    translationOfLabelHeaderLine3Th: z.string().min(7, {
        message: 'Header Line 3 must be at least 7 characters long',
    }),
    acquirer: z.array(acquirerSchema).default([]),
    issuer: z.array(issuerSchema).default([]),
    capk: z.array(capkSchema).default([]),
});

const TtbConfigForm: React.FC = () => {
    // Form Loading State
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            templateFile: 'config_EVP_onlyTTB.json',
            translationOfLabelHeaderLine1En: '',
            translationOfLabelHeaderLine1Th: '',
            translationOfLabelHeaderLine2En: '',
            translationOfLabelHeaderLine2Th: '',
            translationOfLabelHeaderLine3En: '',
            translationOfLabelHeaderLine3Th: '',
            acquirer: [],
            issuer: [],
            capk: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'issuer',
    });

    const handleAddIssuer = () => {
        append({
            name: '',
            nonEmvTranRequirePIN: false,
            adjustPercent: 0,
            isAllowManualPan: false,
            panMaskPattern: '',
            bindToAcquirer: '',
            smallAmtLimit: 0,
            isEnableOffline: false,
            isEnableAdjust: false,
            isEnableRefund: false,
            isAllowCheckExpiry: false,
            isEnablePreAuth: false,
        });
    };

    const handleRemoveIssuer = (index: number) => {
        remove(index);
    };

    const [generatedConfig, setGeneratedConfig] = useState(null);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            // Set loading state to true
            setLoading(true);
            setGeneratedConfig(null);

            const raw = await fetch('/api/generate-ttb-config', {
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
                toast('Config generated successfully', { type: 'success' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert(response.message);
            }
        } catch (error) {
            alert('Error generating config');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const onTemplateSelected = (value: string) => {
        form.setValue(
            'templateFile',
            value as z.infer<typeof FormSchema>['templateFile']
        );
    }

    // Based on Selected Template File, we can set the default values for the form fields by loading the JSON file
    // This can be done by using the `useEffect` hook
    const { watch, setValue, getValues } = form;
    const templateFile = watch('templateFile');

    useEffect(() => {
        async function loadTemplateFile() {
            setValue('issuer', []);
            try {
                const raw = await fetch(`/ttb_config/${templateFile}`);
                if (!raw.ok) {
                    const errorResponse = await raw.json();
                    toast(errorResponse.message, { type: 'error' });
                    return;
                }
                const response = await raw.json();
                const { configuration } = response;
                if (configuration.issuer.length > 0) {
                    setValue('issuer', configuration.issuer);
                }
            } catch (error) {
                toast('Error loading template file', { type: 'error' });
                console.error(error);
            }
        }

        loadTemplateFile();
    }, [templateFile, setValue, getValues]);


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
                                    onValueChange={onTemplateSelected}
                                    value={form.getValues('templateFile')}>
                                    <FormControl>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder="Select a template file" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Only TTB</SelectLabel>
                                            <SelectItem value="config_EVP_onlyTTB.json">TTB Config (Only TTB)</SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>TTB Card and KSher</SelectLabel>
                                            <SelectItem value="config_EVP_TTB_Card_PromptPay.json">TTB Config ( TTB Card Only )</SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>TTB Card and TTB Prompt Pay</SelectLabel>
                                            <SelectItem value="config_EVP_TTB_OnlyCard.json">TTB Config ( TTB Card and Prompt Pay )</SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>TTB Card, TTB Prompt Pay and KSher</SelectLabel>
                                            <SelectItem value="config_EVP_TTB_TTBCard_TTBPromptPay_KSher.json">TTB Config ( TTB Card, Prompt Pay and KSher )</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                    <FormMessage>
                                        {form.formState.errors.templateFile?.message}
                                    </FormMessage>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <hr className="my-6" />
                    <h2 className="text-2xl font-semibold my-4">Configuration Setting</h2>
                    <div className="flex flex-col space-y-4">
                        <FormField
                            control={form.control}
                            name="translationOfLabelHeaderLine1En"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel htmlFor={field.name}>
                                        Header Line 1 in English (
                                        configuration {'>'} translation {'>'} labelHeaderLine1 {'>'} en )
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className={`${form.formState.errors.translationOfLabelHeaderLine1En && 'ring-2 focus:outline-none ring-red-500'}`}
                                        />
                                    </FormControl>
                                    <FormMessage>
                                        {form.formState.errors.translationOfLabelHeaderLine1En?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="translationOfLabelHeaderLine1Th"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel htmlFor={field.name}>
                                        Header Line 1 in Thai (
                                        configuration {'>'} translation {'>'} labelHeaderLine1 {'>'} th )
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className={`${form.formState.errors.translationOfLabelHeaderLine1Th && 'ring-2 focus:outline-none ring-red-500'}`}
                                        />
                                    </FormControl>
                                    <FormMessage>
                                        {form.formState.errors.translationOfLabelHeaderLine1Th?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="translationOfLabelHeaderLine2En"
                            render={({field}) => (
                                <FormItem className="space-y-3">
                                    <FormLabel htmlFor={field.name}>
                                        Header Line 2 in English (
                                        configuration {'>'} translation {'>'} labelHeaderLine2 {'>'} en )
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className={`${form.formState.errors.translationOfLabelHeaderLine2En && 'ring-2 focus:outline-none ring-red-500'}`}
                                        />
                                    </FormControl>
                                    <FormMessage>
                                        {form.formState.errors.translationOfLabelHeaderLine1Th?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="translationOfLabelHeaderLine2Th"
                            render={({field}) => (
                                <FormItem className="space-y-3">
                                    <FormLabel htmlFor={field.name}>
                                        Header Line 2 in Thai (
                                        configuration {'>'} translation {'>'} labelHeaderLine2 {'>'} th )
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className={`${form.formState.errors.translationOfLabelHeaderLine2Th && 'ring-2 focus:outline-none ring-red-500'}`}
                                        />
                                    </FormControl>
                                    <FormMessage>
                                        {form.formState.errors.translationOfLabelHeaderLine2Th?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="translationOfLabelHeaderLine3En"
                            render={({field}) => (
                                <FormItem className="space-y-3">
                                    <FormLabel htmlFor={field.name}>
                                        Header Line 3 in English (
                                        configuration {'>'} translation {'>'} labelHeaderLine3 {'>'} en )
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className={`${form.formState.errors.translationOfLabelHeaderLine3En && 'ring-2 focus:outline-none ring-red-500'}`}
                                        />
                                    </FormControl>
                                    <FormMessage>
                                        {form.formState.errors.translationOfLabelHeaderLine3En?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="translationOfLabelHeaderLine3Th"
                            render={({field}) => (
                                <FormItem className="space-y-3">
                                    <FormLabel htmlFor={field.name}>
                                        Header Line 3 in Thai (
                                        configuration {'>'} translation {'>'} labelHeaderLine3 {'>'} th )
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className={`${form.formState.errors.translationOfLabelHeaderLine3Th && 'ring-2 focus:outline-none ring-red-500'}`}
                                        />
                                    </FormControl>
                                    <FormMessage>
                                        {form.formState.errors.translationOfLabelHeaderLine3Th?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold my-4">Issuer Configuration</h2>
                        </div>
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex flex-col space-y-4 border p-4 mb-4 rounded-lg">
                                <h3 className="font-semibold">Issuer {index + 1}</h3>
                                <FormField
                                    control={form.control}
                                    name={`issuer.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name}>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Issuer Name"
                                                    className={`${form.formState.errors.issuer?.[index]?.name && 'ring-2 focus:outline-none ring-red-500'}`}
                                                />
                                            </FormControl>
                                            <FormMessage>
                                                {(form.formState.errors.issuer?.[index]?.name)?.message}
                                            </FormMessage>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`issuer.${index}.nonEmvTranRequirePIN`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name}>Non-EMV Transaction Require PIN</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(value) => form.setValue(
                                                        `issuer.${index}.nonEmvTranRequirePIN`,
                                                        value === 'true'
                                                    )}
                                                    value={String(form.getValues(`issuer.${index}.nonEmvTranRequirePIN`))}>
                                                    <FormControl>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue placeholder="Select an option" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="true">True</SelectItem>
                                                        <SelectItem value="false">False</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`issuer.${index}.adjustPercent`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name}>Adjust Percent</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" />
                                            </FormControl>
                                            <FormMessage>
                                                {(form.formState.errors.issuer?.[index]?.adjustPercent)?.message}
                                            </FormMessage>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`issuer.${index}.isAllowManualPan`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name}>Allow Manual PAN</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(value) => form.setValue(
                                                        `issuer.${index}.isAllowManualPan`,
                                                        value === 'true'
                                                    )}
                                                    value={String(form.getValues(`issuer.${index}.isAllowManualPan`))}>
                                                    <FormControl>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue placeholder="Select an option" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="true">True</SelectItem>
                                                        <SelectItem value="false">False</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`issuer.${index}.panMaskPattern`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name}>PAN Mask Pattern</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="PAN Mask Pattern" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`issuer.${index}.bindToAcquirer`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name}>Bind to Acquirer</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Bind to Acquirer" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`issuer.${index}.smallAmtLimit`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name}>Small Amount Limit</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" />
                                            </FormControl>
                                            <FormMessage>
                                                {(form.formState.errors.issuer?.[index]?.smallAmtLimit)?.message}
                                            </FormMessage>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`issuer.${index}.isEnableOffline`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name}>Enable Offline</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(value) => form.setValue(
                                                        `issuer.${index}.isEnableOffline`,
                                                        value === 'true'
                                                    )}
                                                    value={String(form.getValues(`issuer.${index}.isEnableOffline`))}>
                                                    <FormControl>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue placeholder="Select an option" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="true">True</SelectItem>
                                                        <SelectItem value="false">False</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`issuer.${index}.isEnableAdjust`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name}>Enable Adjust</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(value) => form.setValue(
                                                        `issuer.${index}.isEnableAdjust`,
                                                        value === 'true'
                                                    )}
                                                    value={String(form.getValues(`issuer.${index}.isEnableAdjust`))}>
                                                    <FormControl>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue placeholder="Select an option" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="true">True</SelectItem>
                                                        <SelectItem value="false">False</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`issuer.${index}.isEnableRefund`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name}>Enable Refund</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(value) => form.setValue(
                                                        `issuer.${index}.isEnableRefund`,
                                                        value === 'true'
                                                    )}
                                                    value={String(form.getValues(`issuer.${index}.isEnableRefund`))}>
                                                    <FormControl>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue placeholder="Select an option" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="true">True</SelectItem>
                                                        <SelectItem value="false">False</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`issuer.${index}.isAllowCheckExpiry`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name}>Allow Check Expiry</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(value) => form.setValue(
                                                        `issuer.${index}.isAllowCheckExpiry`,
                                                        value === 'true'
                                                    )}
                                                    value={String(form.getValues(`issuer.${index}.isAllowCheckExpiry`))}>
                                                    <FormControl>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue placeholder="Select an option" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="true">True</SelectItem>

                                                        <SelectItem value="false">False</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`issuer.${index}.isEnablePreAuth`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor={field.name}>Enable Pre-Auth</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(value) => form.setValue(
                                                        `issuer.${index}.isEnablePreAuth`,
                                                        value === 'true'
                                                    )}
                                                    value={String(form.getValues(`issuer.${index}.isEnablePreAuth`))}>
                                                    <FormControl>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue placeholder="Select an option" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="true">True</SelectItem>
                                                        <SelectItem value="false">False</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button type="button" onClick={() => handleRemoveIssuer(index)} className="mt-2">
                                    Remove Issuer
                                </Button>
                                {
                                    index === fields.length - 1 && (
                                        <Button type="button" onClick={handleAddIssuer} className="mt-2">
                                            Add Issuer
                                        </Button>
                                    )
                                }
                            </div>
                        ))}

                        <Button type="submit" className="mt-4 relative" disabled={loading}>
                            {loading ? (
                                <>
                                    <span
                                        className="opacity-0">Generate Config</span> {/* Invisible placeholder to keep size */}
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <PulseLoader color="#fff" size={10}/>
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

export default TtbConfigForm;