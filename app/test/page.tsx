"use client";

import { Button } from "@/components/ui/button";
import fetchWithAuth from "@/lib/api";

export default function Main() {
  function handleClick() {
    fetchWithAuth("/api/test", {
      method: "post",
    });
  }

  return (
    <>
      <div className="underline">hello</div>
      <Button onClick={handleClick}>button</Button>
      <Button variant="outline">Button</Button>
    </>
  );
}
