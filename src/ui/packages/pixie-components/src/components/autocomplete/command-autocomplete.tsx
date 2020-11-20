import clsx from 'clsx';
import * as React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { CommandAutocompleteInput } from 'components/autocomplete/command-autocomplete-input';
import { scrollbarStyles } from 'mui-theme';
import { Completions, CompletionId, CompletionItem } from './completions';
import {
  TabStop, findNextItem, ItemsMap, TabStopParser,
} from './utils';
import { Key } from './key';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    backgroundColor: theme.palette.background.three,
    cursor: 'text',
    display: 'flex',
    flexDirection: 'column',
    // TODO(malthus): remove this once the scrollbar theme is set at global level.
    ...scrollbarStyles(theme),
  },
  input: {
    backgroundColor: theme.palette.background.two,
  },
  completions: {
    flex: 1,

    minHeight: 0,
  },
}));

// Each tabstop is associated with a list of suggestions. These are the suggestions that
// should be shown when the cursor position is on a specific tabstop.
export interface TabSuggestion {
  index: number;
  // Whether the command becomes valid after a suggestion for this tabstop is chosen. Currently this is unused,
  // but we may use this for optimizations in the future.
  executableAfterSelect: boolean;
  suggestions: CompletionItem[];
}

type AutocompleteAction = 'EDIT' | 'SELECT';

interface NewAutoCompleteProps {
  onSubmit: () => void; // This is called when the user presses enter, and no suggestions are highlighted.
  onChange: (
    input: string,
    cursor: number,
    action: AutocompleteAction,
    updatedTabStops: TabStop[]
  ) => void;
  completions: Array<TabSuggestion>;
  tabStops: Array<TabStop>;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
  placeholder?: string;
  isValid: boolean;
}

export const CommandAutocomplete: React.FC<NewAutoCompleteProps> = ({
  onSubmit,
  onChange,
  tabStops,
  completions,
  prefix,
  suffix,
  className,
  isValid,
  placeholder = '',
}) => {
  const classes = useStyles();

  const [cursorPos, setCursorPos] = React.useState(0);
  const [activeCompletions, setActiveCompletions] = React.useState([]);
  const [activeItem, setActiveItem] = React.useState<CompletionId>('');

  // Parse tabstops to get boundary and input info.
  const tsInfo = React.useMemo(() => new TabStopParser(tabStops), [tabStops]);

  React.useEffect(() => {
    setCursorPos(tsInfo.getInitialCursor());
  }, [tsInfo]);

  const itemsMap = React.useMemo(() => {
    const map: ItemsMap = new Map();
    activeCompletions.forEach((item, index) => {
      if (!item.header) {
        map.set(item.id, { title: item.title, index, type: item.itemType });
      }
    });
    return map;
  }, [activeCompletions]);

  // Show different suggestions when cursor position changes.
  React.useEffect(() => {
    if (completions.length === 0) {
      return;
    }

    const tabIdx = tsInfo.getActiveTab(cursorPos);
    if (completions[tabIdx] === undefined) {
      setActiveCompletions([]);
    } else {
      setActiveCompletions(completions[tabIdx].suggestions);
    }
    setActiveItem('');
  }, [cursorPos, completions, tsInfo]);

  const handleSelection = React.useCallback(
    (id) => {
      if (!itemsMap.has(id)) {
        return;
      }
      const item = itemsMap.get(id);
      const [newStr, newCursorPos] = tsInfo.handleCompletionSelection(
        cursorPos,
        item,
      );
      onChange(newStr, newCursorPos, 'SELECT', null);
    },
    [itemsMap, cursorPos, tsInfo, onChange],
  );

  const handleBackspace = React.useCallback(
    (pos) => {
      if (pos !== 0) {
        const [
          newStr,
          newCursorPos,
          newTabStops,
          deletedTabStop,
        ] = tsInfo.handleBackspace(pos);
        onChange(
          newStr,
          newCursorPos,
          'EDIT',
          deletedTabStop ? null : newTabStops,
        );
      }
    },
    [tsInfo, onChange],
  );

  const handleLeftKey = React.useCallback(
    (pos) => {
      const activeTab = tsInfo.getActiveTab(pos);
      const tabBoundaries = tsInfo.getTabBoundaries();
      if (pos - 1 >= tabBoundaries[activeTab][0]) {
        // Cursor is still within the current tabstop.
        setCursorPos(pos - 1);
      } else if (activeTab !== 0) {
        // Cursor should move to the previous tabstop.
        setCursorPos(tabBoundaries[activeTab - 1][1] - 1);
      }
    },
    [tsInfo],
  );

  const handleRightKey = React.useCallback(
    (pos) => {
      const activeTab = tsInfo.getActiveTab(pos);
      const tabBoundaries = tsInfo.getTabBoundaries();

      if (pos + 1 < tabBoundaries[activeTab][1]) {
        // Cursor is still within the current tabstop.
        setCursorPos(pos + 1);
      } else if (activeTab !== tabStops.length - 1) {
        // Cursor should move to the next tabstop.
        setCursorPos(tabBoundaries[activeTab + 1][0]);
      }
    },
    [tsInfo, tabStops.length],
  );

  const handleKey = (key: Key) => {
    switch (key) {
      case 'UP':
        setActiveItem(
          findNextItem(activeItem, itemsMap, activeCompletions, -1),
        );
        break;
      case 'DOWN':
        setActiveItem(findNextItem(activeItem, itemsMap, activeCompletions));
        break;
      case 'TAB':
        setActiveItem(findNextItem(activeItem, itemsMap, activeCompletions));
        break;
      case 'LEFT':
        handleLeftKey(cursorPos);
        break;
      case 'RIGHT':
        handleRightKey(cursorPos);
        break;
      case 'ENTER':
        // If active item is selected, then handle selection. Otherwise, make a request to submit.
        if (activeItem === '') {
          onSubmit();
        } else {
          handleSelection(activeItem);
        }
        break;
      case 'BACKSPACE':
        handleBackspace(cursorPos);
        break;
      default:
    }
  };

  const onChangeHandler = React.useCallback(
    (input: string, pos: number) => {
      onChange(input, pos, 'EDIT', tsInfo.handleChange(input, pos));
    },
    [onChange, tsInfo],
  );

  return (
    <div className={clsx(classes.root, className)}>
      <CommandAutocompleteInput
        className={classes.input}
        cursorPos={cursorPos}
        setCursor={setCursorPos}
        onChange={onChangeHandler}
        onKey={handleKey}
        value={tsInfo.getInput()}
        prefix={prefix}
        suffix={suffix}
        placeholder={placeholder}
        isValid={isValid}
      />
      <Completions
        className={classes.completions}
        items={activeCompletions}
        onActiveChange={setActiveItem}
        onSelection={handleSelection}
        activeItem={activeItem}
      />
    </div>
  );
};
