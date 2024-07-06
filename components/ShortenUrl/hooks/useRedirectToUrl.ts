import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ShortenUrlRepo } from "components/ShortenUrl/repo/ShortenUrlRepo";

function redirect(url: string) {
    window.location.href = url
}

export function useLoadingAndErr() {
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<any>();
    return { loading, setLoading, err, setErr };
}

export function useRedirectToUrl() {
    const router = useRouter();
    const urlHash = router.query.hash as string;

    const { loading, setLoading, err, setErr } = useLoadingAndErr();

    useEffect(() => {
        if (!urlHash) return
        if (loading) return

        (async () => {
                try {
                    setLoading(true)
                    const shortenUrlDto = await ShortenUrlRepo.getByHash(urlHash);
                    const url = shortenUrlDto.data.url;
                    if (!url) return

                    redirect(url)
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
