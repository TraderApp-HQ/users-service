import { Response, Request } from "express";

export function saveRefreshTokenCookie( res: Response, refreshToken: string) {

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie will expire in 7 days
    };

  res.cookie('refreshToken', refreshToken, cookieOptions);
}

export function getRefreshTokenCookie( req: Request ) {
  const {refreshToken} = req.cookies
  return refreshToken;
}

export function clearRefreshTokenCookie( res: Response) {
  res.cookie('refreshToken', "", {maxAge: 0})
}

//validate refresh token and send back newly created access token
//question: it is only suppose to return access token and how is cookies more secure