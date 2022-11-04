class UrlBuilder {
    buildQueryParams = (params: any) => {
        return params
            .filter((param: any) => param.value !== param.default)
            .map((param: any) => `${param.name}=${encodeURIComponent(param.value)}`)
            .join('&');
    }
}

let urlBuilder = new UrlBuilder();
export default urlBuilder;