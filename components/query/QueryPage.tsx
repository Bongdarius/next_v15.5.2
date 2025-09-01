"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function QueryPage() {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      const rawQuery = searchParams.get("data") || "";

      // 1. atob로 Base64 → 문자 코드 문자열
      const binaryString = atob(rawQuery);

      // 2. 각 문자를 charCode로 변환 → Uint8Array
      const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));

      // 3. TextDecoder로 다시 문자열로 변환
      const decoded = new TextDecoder().decode(bytes);

      console.log(decoded); // "name=홍길동"

      const json = JSON.parse(decoded);

      setQuery(json.data);
    } catch (error) {
      setQuery("");
    }
  }, []);

  useEffect(() => {
    const json = {
      data: query,
    };

    const encodedValue = btoa(
      String.fromCharCode(...new TextEncoder().encode(JSON.stringify(json)))
    );

    window.history.pushState({ page: "query" }, "", `?data=${encodedValue}`);
  }, [query]);

  const handleSubmit = () => {
    // 입력된 쿼리 값을 콘솔에 출력하거나 API로 전송할 수 있습니다.
    console.log("Submitted Query:", query);
    alert("Query submitted! Check the console.");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Query Input</CardTitle>
          <CardDescription>
            Please enter your multi-line query in the text area below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="query-textarea">Your Query</Label>
            <Textarea
              id="query-textarea"
              className="min-h-[200px] font-mono"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmit}>Submit Query</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
