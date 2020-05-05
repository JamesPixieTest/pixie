import { VizierQueryError } from 'common/errors';
import * as ls from 'common/localstorage';
import { Table, VizierQueryFunc } from 'common/vizier-grpc-client';
import ClientContext from 'common/vizier-grpc-client-context';
import { SnackbarProvider, useSnackbar } from 'components/snackbar/snackbar';
import { parseSpecs, VisualizationSpecMap } from 'components/vega/spec';
import * as React from 'react';
import { setQueryParams } from 'utils/query-params';

import { DataDrawerContext, DataDrawerContextProvider } from './context/data-drawer-context';
import { LayoutContextProvider } from './context/layout-context';
import { getQueryFuncs, parseVis, Vis } from './vis';

interface LiveContextProps {
  vizierReady: boolean;
  setScripts: (script: string, vis: string, title: Title, args: Arguments) => void;
  executeScript: (script?: string, vis?: Vis, args?: Arguments) => void;
  updateScript: (code: string) => void;
  updateVis: (spec: Vis) => void;
}

interface Tables {
  [name: string]: Table;
}

interface Results {
  error?: Error;
  tables: Tables;
}

interface Title {
  title: string;
  id: string;
}

interface Arguments {
  [arg: string]: string;
}

interface ArgsContextProps {
  args: Arguments;
  setArgs: (args: Arguments) => void;
}

export const ScriptContext = React.createContext<string>('');
export const ResultsContext = React.createContext<Results>(null);
export const LiveContext = React.createContext<LiveContextProps>(null);
export const TitleContext = React.createContext<Title>(null);
export const VisContext = React.createContext<Vis>(null);
export const ArgsContext = React.createContext<ArgsContextProps>(null);

// Filters the arguments to only those that are specified in Vis.
function argsForVis(vis: Vis, args: Arguments): Arguments {
  if (!args) {
    return {};
  }
  const visArgs = new Set(vis.variables.map((v) => v.name));
  const outArgs = {};
  Object.keys(args).forEach((keyName) => {
    if (keyName === 'script' || visArgs.has(keyName)) {
      outArgs[keyName] = args[keyName];
    }
  });
  return outArgs;
}

const LiveContextProvider = (props) => {
  const [script, setScript] = ls.useLocalStorage(ls.LIVE_VIEW_PIXIE_SCRIPT_KEY, '');

  const [results, setResults] = React.useState<Results>({ tables: {} });

  const [vis, setVis] = React.useState<Vis>(parseVis(ls.getLiveViewVisSpec()) || { variables: [], widgets: [] });
  React.useEffect(() => {
    ls.setLiveViewVisSpec(JSON.stringify(vis, null, 2));
  }, [vis]);

  const setScripts = React.useCallback((newScript, newVis, newTitle, newArgs) => {
    setScript(newScript);
    setTitle(newTitle);
    const parsedVis = parseVis(newVis) || { variables: [], widgets: [] };
    setVis(parsedVis);
    setArgsRaw(argsForVis(parsedVis, newArgs));
  }, []);

  const [title, setTitle] = ls.useLocalStorage<Title>(ls.LIVE_VIEW_TITLE_KEY, null);

  // setArgsRaw sets the args without considering the context of the vis.
  // the exported setArgs listens to the vis and only sets those args which are specified in the vis.
  const [args, setArgsRaw] = React.useState<Arguments | null>(null);

  const argsContext = React.useMemo(() => {
    return {
      // Only return the arguments that apply to the current vis spec.
      args: argsForVis(vis, args),
      setArgs: (inputArgs: Arguments) => {
        return setArgsRaw(argsForVis(vis, inputArgs));
      },
    };
  }, [args, setArgsRaw, vis]);

  React.useEffect(() => {
    if (args) {
      setQueryParams(args);
    }
  }, [args]);

  const client = React.useContext(ClientContext);

  const showSnackbar = useSnackbar();

  const { openDrawerTab } = React.useContext(DataDrawerContext);

  const executeScript = React.useCallback((inputScript?: string, inputVis?: Vis, inputArgs?: Arguments) => {
    if (!client) {
      return;
    }

    let errMsg: string;
    let queryId: string;

    new Promise((resolve, reject) => {
      try {
        resolve(getQueryFuncs(inputVis || vis, inputArgs || args || {}));
      } catch (error) {
        reject(error);
      }
    })
      .then((funcs: VizierQueryFunc[]) => client.executeScript(inputScript || script, funcs))
      .then((queryResults) => {
        const newTables = {};
        queryId = queryResults.queryId;
        for (const table of queryResults.tables) {
          newTables[table.name] = table;
        }
        setResults({ tables: newTables });
      }).catch((error) => {
        const errType = (error as VizierQueryError).errType;
        errMsg = error.message;
        if (errType === 'execution') {
          showSnackbar({
            message: errMsg,
            action: () => openDrawerTab('errors'),
            actionTitle: 'details',
            autoHideDuration: 5000,
          });
        } else {
          showSnackbar({
            message: errMsg,
            action: () => executeScript(inputScript),
            actionTitle: 'retry',
            autoHideDuration: 5000,
          });
        }
        setResults({ tables: {}, error });
      }).finally(() => {
        analytics.track('Query Execution', {
          status: errMsg ? 'success' : 'failed',
          query: script,
          queryID: queryId,
          error: errMsg,
          title,
        });
      });
  }, [client, script, vis, title, args]);

  const liveViewContext = React.useMemo(() => ({
    updateScript: setScript,
    vizierReady: !!client,
    setScripts,
    executeScript,
    updateVis: setVis,
  }), [executeScript, client]);

  return (
    <LiveContext.Provider value={liveViewContext}>
      <TitleContext.Provider value={title}>
        <ArgsContext.Provider value={argsContext}>
          <ScriptContext.Provider value={script}>
            <ResultsContext.Provider value={results}>
              <VisContext.Provider value={vis}>
                {props.children}
              </VisContext.Provider>
            </ResultsContext.Provider>
          </ScriptContext.Provider>
        </ArgsContext.Provider>
      </TitleContext.Provider>
    </LiveContext.Provider>
  );
};

export function withLiveContextProvider(WrappedComponent) {
  return () => (
    <SnackbarProvider>
      <LayoutContextProvider>
        <DataDrawerContextProvider>
          <LiveContextProvider>
            <WrappedComponent />
          </LiveContextProvider>
        </DataDrawerContextProvider>
      </LayoutContextProvider>
    </SnackbarProvider>
  );
}
