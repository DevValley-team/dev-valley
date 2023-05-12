import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToInstance } from "class-transformer";

interface ClassConstructor<T> {
  new (...args: any[]): T;
}

export function SerializeAndSetIsAuthor<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor<T>(dto));
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private readonly dto: ClassConstructor<T>) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        const request = context.switchToHttp().getRequest();
        const currentUser = request.user;
        const transformedData = plainToInstance(this.dto, data, { strategy: 'excludeAll' });
        transformedData['isAuthor'] = data.user?.id === currentUser?.id;
        return transformedData;
      })
    )
  }
}
