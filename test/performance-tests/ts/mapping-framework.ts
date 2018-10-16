import { SimpleMappingPerformance } from './simple-mapping-performance';

export interface IPerformanceTestResult {
	class: string;
	test: string;
	repetitions: number;
	creationTimeInMs: number;
	executionTimeInMs: number;
	referenceExecutionTimeInMs: number;
}

export class MappingPerformanceTestFrame {
	public execute(repetitions: number = 1 * 1000 * 1000): Array<AutoMapperJS.IPerformanceTestResult> {
		const results = new Array<IPerformanceTestResult>();

		results.push(...new SimpleMappingPerformance().execute(repetitions));

		return results;
	}
}
