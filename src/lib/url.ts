import { useCallback, useEffect, useState } from "react";

/**
 * The few pieces of a router the gallery actually needs, on the History API.
 *
 * Every route is a real page now, so nothing here renders a different page; it
 * only lets the gallery open, step through and close a photograph without a
 * reload, and keep the address bar honest while it does.
 */

const EVENT = "exoad:navigate";

interface Location {
    pathname: string;
    search: string;
}

function read(): Location {
    return { pathname: window.location.pathname, search: window.location.search };
}

export function navigate(to: string, { replace = false } = {}) {
    if (replace) history.replaceState(null, "", to);
    else history.pushState(null, "", to);
    window.dispatchEvent(new Event(EVENT));
}

/**
 * The current location. Starts from `initial` so the first client render
 * matches what was rendered at build time, then follows the real address.
 */
export function useLocation(initial: Location): Location {
    const [location, setLocation] = useState(initial);

    useEffect(() => {
        const sync = () => setLocation(read());
        sync();
        window.addEventListener("popstate", sync);
        window.addEventListener(EVENT, sync);
        return () => {
            window.removeEventListener("popstate", sync);
            window.removeEventListener(EVENT, sync);
        };
    }, []);

    return location;
}

export function useNavigate() {
    return useCallback(navigate, []);
}
