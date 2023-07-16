export function l(f: () => Promise<any>) {
	return f()
}

export function importClient() {
	return import('@fn/client')
}
