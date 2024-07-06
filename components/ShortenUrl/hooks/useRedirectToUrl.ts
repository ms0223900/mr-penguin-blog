import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ShortenUrlRepo } from "components/ShortenUrl/repo/ShortenUrlRepo";

export function useRedirectToUrl() {
    const router = useRouter();
    const urlHash = router.query.hash as string;

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<any>();

    useEffect(() => {
        if (!urlHash) return
        if (loading) return

        (async () => {
                try {
                    setLoading(true)
                    const shortenUrlDto = await ShortenUrlRepo.getByHash(urlHash);
                    const url = shortenUrlDto.data.url;
                    if (!url) return

                    window.location.href = url
                } catch (e: unknown) {
                    setErr(e as any)
                } finally {
                    setLoading(false)
                }
            }
        )()
    }, [urlHash])
    return { loading, err, urlHash };
}
