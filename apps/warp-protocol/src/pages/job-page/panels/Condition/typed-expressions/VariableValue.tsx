import { UIElementProps } from '@terra-money/apps/components';
import { Job } from 'types/job';
import { resolveVariableRef, variableName } from 'utils/variable';

export type VariableValueProps = {
  variableRef: string;
  job: Job;
} & UIElementProps;

export const VariableValue = (props: VariableValueProps) => {
  const { job, variableRef } = props;

  const variable = resolveVariableRef(variableRef, job.vars);

  return <span>{variableName(variable)}</span>;
};