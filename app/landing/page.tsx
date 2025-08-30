import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, ShieldCheck, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    전 세계 수백만 명의 사용자와 함께하세요
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    저희의 혁신적인 플랫폼에 참여하여 가능성의 세계를 열어보세요. 원활한 협업, 강력한 기능 및 글로벌 커뮤니티가 여러분을 기다립니다.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/signup">
                      지금 바로 시작하기
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="/globe.svg"
                alt="Globe"
                width="550"
                height="550"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  왜 저희 서비스를 선택해야 할까요?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  저희 플랫폼은 여러분의 성공을 돕기 위해 설계된 다양한 기능들을 제공합니다. 다음은 여러분이 좋아할 만한 몇 가지 이유입니다.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Users className="w-8 h-8" />
                  <CardTitle>글로벌 커뮤니티</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>전 세계의 동료, 친구, 협력자들과 연결되세요. 아이디어를 공유하고 프로젝트를 함께 만들어가세요.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <ShieldCheck className="w-8 h-8" />
                  <CardTitle>강력한 보안</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>최첨단 보안 기술로 여러분의 데이터를 안전하게 보호합니다. 안심하고 서비스를 이용하세요.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <TrendingUp className="w-8 h-8" />
                  <CardTitle>성장을 위한 도구</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>생산성을 높이고 성장을 가속화할 수 있는 다양한 분석 및 관리 도구를 제공합니다.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
