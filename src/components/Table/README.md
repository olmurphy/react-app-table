# Table Component

A highly modular and scalable table component for React applications.

## Architecture

The table component follows a modular architecture with clear separation of concerns:

- **Components**: UI components for rendering the table
- **Hooks**: Custom hooks for managing table state and behavior
- **Contexts**: Context providers for sharing state across components
- **Utils**: Utility functions for common operations
- **Types**: TypeScript type definitions

## Sorting Module

The sorting functionality is modularized into:

1. **Custom Hook**: `useTableSort` - Manages sorting state and provides sorting handlers
2. **Utility Functions**: `sortUtils.ts` - Contains pure functions for sorting operations
3. **Types**: `Table.types.ts` - Contains type definitions for sorting

### Usage

```tsx
// In a component
import { useTableSort } from './hooks';

function MyComponent<T>() {
  const { sortState, handleRequestSort, getSortedData } = useTableSort<T>();
  
  // Use the sorting functionality
  const sortedData = getSortedData(data);
  
  return (
    // Render your component
  );
}
```

### Benefits of Modularization

1. **Separation of Concerns**: Sorting logic is isolated from UI components
2. **Reusability**: Sorting functionality can be reused across different components
3. **Testability**: Pure functions are easier to test
4. **Maintainability**: Changes to sorting logic don't require changes to UI components
5. **Performance**: Optimized sorting with memoization and debouncing

## Best Practices

This component follows best practices for building scalable React applications:

1. **Custom Hooks**: Encapsulates complex logic and state management
2. **Context API**: Provides global state without prop drilling
3. **Memoization**: Uses `useMemo` and `useCallback` for performance optimization
4. **TypeScript**: Strong typing for better developer experience
5. **Modular Design**: Clear separation of concerns for better maintainability
6. **Performance Optimization**: Debouncing for expensive operations 