import domain from "./domainVerify"

const cookieOptions = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
    domain
};

export default cookieOptions