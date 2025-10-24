import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Small heuristic remover: hides/removes any stray debug label with exact text like "SDEN".
// This is a safe, low-risk fix (Option B) that looks for visible elements whose
// trimmed textContent matches a short token and removes them from the DOM.
function removeDebugLabels(tokens: string[] = ["SDEN"]) {
	try {
		const matches = (node: Element) => {
			const text = (node.textContent || "").trim();
			return tokens.includes(text);
		};

		const scanAndRemove = (root: ParentNode = document) => {
			tokens.forEach((t) => {
				// find exact-match nodes (text only)
				const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);
				const toRemove: Element[] = [];
				let n = walker.nextNode();
				while (n) {
					const el = n as Element;
					if (matches(el) && el instanceof HTMLElement) {
						// only remove small elements likely to be labels (avoid removing real content)
						const rect = el.getBoundingClientRect();
						if (rect.width < 200 && rect.height < 60) toRemove.push(el);
					}
					n = walker.nextNode();
				}
				toRemove.forEach((el) => el.remove());
			});
		};

		// Initial remove after a short delay to let app render
		setTimeout(() => scanAndRemove(document), 200);

		// Observe later additions (e.g., components that mount after initial render)
		const obs = new MutationObserver((mutations) => {
			for (const m of mutations) {
				if (m.addedNodes && m.addedNodes.length) {
					scanAndRemove(document);
				}
			}
		});
		obs.observe(document.documentElement || document, { childList: true, subtree: true });

		// Stop observing after a while (cleanup) to avoid long-term overhead
		setTimeout(() => obs.disconnect(), 30_000);
	} catch (e) {
		// swallow errors - this is a non-critical cosmetic fix
		// console.warn('removeDebugLabels failed', e);
	}
}

removeDebugLabels(["SDEN"]);

createRoot(document.getElementById("root")!).render(<App />);
