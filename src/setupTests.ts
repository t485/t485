import { configure } from "enzyme";
import React16Adapter from "enzyme-adapter-react-16";
import { JSDOM } from "jsdom";

const jsdom = new JSDOM("<!doctype html><html><body></body></html>");
const { window } = jsdom;

function copyProps(src: any, target: any): void {
	Object.defineProperties(target, {
		...Object.getOwnPropertyDescriptors(src),
		...Object.getOwnPropertyDescriptors(target),
	});
}

(global as any).window = window;
(global as any).document = window.document;
(global as any).navigator = {
	userAgent: "node.js",
};
(global as any).requestAnimationFrame = function(callback: any): any {
	return setTimeout(callback, 0);
};
(global as any).cancelAnimationFrame = function(id: number): void {
	clearTimeout(id);
};
copyProps(window, global);
configure({ adapter: new React16Adapter() });
