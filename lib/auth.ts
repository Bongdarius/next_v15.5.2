
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const ACCESS_TOKEN_EXPIRES_IN = '15m';

/**
 * Refresh Token을 검증하고 새로운 Access Token을 발급합니다.
 * @param refreshToken - 클라이언트로부터 받은 Refresh Token
 * @returns 성공 시 새로운 Access Token, 실패 시 null
 */
export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    // 1. Refresh Token 자체를 검증 (서명, 만료 시간)
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { id: number };

    // 2. DB에 저장된 토큰과 일치하는지, 탈취된 토큰은 아닌지 확인
    const user = await prisma.sysUser.findFirst({
      where: {
        id: decoded.id,
        refresh_token: refreshToken,
      },
    });

    if (!user) {
      // DB에 토큰이 없으면 유효하지 않은 토큰으로 간주
      return null;
    }

    // 3. 새로운 Access Token 발급
    const newAccessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET!, // middleware와 동일한 ACCESS_TOKEN_SECRET 사용
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    return newAccessToken;

  } catch (error) {
    // 토큰 검증 실패(만료, 서명 불일치 등)
    console.error('Error refreshing access token:', error);
    return null;
  }
}
