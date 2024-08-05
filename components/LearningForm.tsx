"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPredictions } from "@/actions/prediction/fetch-predictions";


const FormSchema = z.object({

  text: z.string({ message: "단어 또는 문장을 입력해 주세요" })
});

export function LearningForm() {

  const [result, setResult] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  });
  const router = useRouter();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const res = await fetchPredictions([data.text]);
      setResult(res.status);
      toast.success(`${res.status} 상태입니다.`);
      router.refresh();
    });
  }

  return (
    <>
      <Button className={"mb-20"} variant={isOpen ? "destructive" : "default"}
              onClick={() => setIsOpen(e => !e)}>{isOpen ? "닫기" : "평가하기"}</Button>
      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle>
              내가 생각한 문구는 어떤 장 상태일까요?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <FormField
                  control={form.control}
                  name={"text"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={"md:text-lg font-bold"}>데이터 입력</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={"예적금 하는 사람이 이해가 안되네요..."}
                          disabled={isPending}
                          type={""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">저장</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </>
  );
}