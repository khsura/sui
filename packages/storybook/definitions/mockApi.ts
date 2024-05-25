/* eslint-disable @typescript-eslint/no-explicit-any */
import type { HttpMethod, HttpStatus } from '@khsura/storybook/constants'

export interface MockApiConfig<
  Request = any,
  ResponseBody = any,
  Method extends HttpMethod = HttpMethod,
  Response extends MockApiResponse<ResponseBody, Request, Method> = MockApiResponse<ResponseBody, Request, Method>,
> {
  url: string
  method: HttpMethod
  status: HttpStatus
  response: Response
  delay?: number
}

export interface MockApiRequest<RequestParams = Record<string, any>, M extends HttpMethod = HttpMethod> {
  url: string
  method: M
  body: string
  searchParams?: M extends HttpMethod.get ? RequestParams : never
}

export type MockApiResponse<Response, Request, Method extends HttpMethod> =
  | Response
  | ((request: MockApiRequest<Request, Method>) => Response)
