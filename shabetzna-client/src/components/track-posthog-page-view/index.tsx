import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TrackPosthogPageView = () => {
    const location = useLocation();
    const posthog = usePostHog();

    useEffect(() => {
        if (posthog) {
            posthog.capture('$pageview', {
                path: location.pathname,
            });
        }
    }, [location, posthog]);

    return null;
}

export default TrackPosthogPageView;
