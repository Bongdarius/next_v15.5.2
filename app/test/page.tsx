"use client";

import { Button } from "@/components/ui/button";

export default function Main() {
  function handleClick() {
    fetch("/api/test", {
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
