import { UIElementProps } from '@terra-money/apps/components';
import { microfy } from '@terra-money/apps/libs/formatting';
import { useLocalWallet } from '@terra-money/apps/hooks';
import { IfConnected } from 'components/if-connected';
import { Throbber } from 'components/primitives';
import { Navigate, Route, Routes, useNavigate } from 'react-router';
import { useCreateJobTx } from 'tx/useCreateJobTx';
import { warp_resolver, warp_templates } from '@terra-money/warp-sdk';
import { ConditionForm } from './condition-form/ConditionForm';
import { DetailsForm } from './details-form/DetailsForm';
import styles from './JobNew.module.sass';
import { decodeMsg, useJobStorage } from './useJobStorage';
import { VariableDrawer } from './variable-drawer/VariableDrawer';
import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { CachedVariablesSession } from './CachedVariablesSession';
import { DeveloperForm } from './developer-form/DeveloperForm';
import { filterUnreferencedVariables } from 'utils/msgs';
import { useNativeToken } from 'hooks/useNativeToken';

type JobNewProps = UIElementProps & {};

export const JobNew = (props: JobNewProps) => {
  const { detailsInput, setDetailsInput } = useJobStorage();

  const [txResult, createJobTx] = useCreateJobTx();

  const localWallet = useLocalWallet();
  const navigate = useNavigate();

  const varsInput = useMemo(() => detailsInput?.template?.vars, [detailsInput]);

  const [searchParams] = useSearchParams();

  const mode = searchParams.get('mode') ?? 'advanced';

  const nativeToken = useNativeToken();

  return (
    <CachedVariablesSession input={varsInput}>
      <div className={styles.root}>
        <IfConnected
          then={
            !localWallet.connectedWallet ? (
              <Throbber className={styles.loading} />
            ) : (
              <>
                <Routes>
                  <Route
                    path="/details"
                    element={
                      <>
                        <VariableDrawer />
                        <DetailsForm
                          mode={mode}
                          className={styles.details}
                          loading={txResult.loading}
                          detailsInput={detailsInput}
                          onNext={async (props) => {
                            const { template } = props;

                            if (mode === 'advanced' || !template?.condition) {
                              setDetailsInput(props);
                              navigate('/job-new/condition');
                            } else {
                              const {
                                template = {} as warp_templates.Template,
                                name,
                                reward,
                                message,
                                description,
                                variables,
                                recurring,
                              } = props;
                              const { condition } = template;

                              const msgs = parseMsgs(message);
                              const vars = filterUnreferencedVariables(variables, msgs, condition!);

                              const resp = await createJobTx({
                                name,
                                vars,
                                description,
                                recurring,
                                reward: microfy(reward, nativeToken.decimals),
                                msgs,
                                condition: condition!,
                              });

                              if (resp.code !== 0) {
                                navigate('/jobs');
                              }
                            }
                          }}
                        />
                      </>
                    }
                  />
                  <Route
                    path="/condition"
                    element={
                      <>
                        <VariableDrawer />
                        <ConditionForm
                          className={styles.condition}
                          loading={txResult.loading}
                          onNext={async (props) => {
                            if (detailsInput) {
                              const { cond, variables } = props;
                              const { name, reward, message, description, recurring } = detailsInput;

                              const msgs = parseMsgs(message);

                              const vars = filterUnreferencedVariables(variables, msgs, cond);

                              const resp = await createJobTx({
                                name,
                                vars,
                                description,
                                reward: microfy(reward, nativeToken.decimals),
                                msgs,
                                recurring,
                                condition: cond,
                              });

                              if (resp.code !== 0) {
                                navigate('/jobs');
                              }
                            }
                          }}
                        />
                      </>
                    }
                  />
                  <Route path="/developer" element={<DeveloperForm className={styles.developer} />} />
                  <Route path="*" element={<Navigate to="/job-new/details?mode=basic" replace />} />
                </Routes>
              </>
            )
          }
        />
      </div>
    </CachedVariablesSession>
  );
};

export const decodeMsgs = (msgs: warp_resolver.CosmosMsgFor_Empty[]) => {
  return msgs.map(decodeMsg);
};

export const encodeMsgs = (value: string): warp_resolver.CosmosMsgFor_Empty[] => {
  const msgs = parseMsgs(value);

  return msgs.map(encodeMsg);
};

export const parseMsgs = (value: string): warp_resolver.CosmosMsgFor_Empty[] => {
  const parsed = JSON.parse(value);
  const msgs: warp_resolver.CosmosMsgFor_Empty[] = Array.isArray(parsed)
    ? (parsed as warp_resolver.CosmosMsgFor_Empty[])
    : [parsed];

  return msgs;
};

export const encodeMsg = (input: warp_resolver.CosmosMsgFor_Empty): warp_resolver.CosmosMsgFor_Empty => {
  if (!('wasm' in input)) {
    return input;
  }

  let msg = input.wasm;

  if ('execute' in msg) {
    msg.execute.msg = base64encode(msg.execute.msg);
  }

  if ('instantiate' in msg) {
    msg.instantiate.msg = base64encode(msg.instantiate.msg);
  }

  if ('migrate' in msg) {
    msg.migrate.msg = base64encode(msg.migrate.msg);
  }

  return { wasm: msg };
};

const base64encode = (input: string): string => {
  return Buffer.from(JSON.stringify(JSON.parse(JSON.stringify(input)))).toString('base64');
};
