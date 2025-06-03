import { useState, useCallback } from 'react';
import type { 
  FactCheckFormState, 
  PerplexityModel, 
  SearchContextSize, 
  SearchRecency 
} from '../types';

/**
 * Custom hook for managing form state with validation
 */
export const useFormState = () => {
  const [formState, setFormState] = useState<FactCheckFormState>({
    statement: '',
    model: 'sonar' as PerplexityModel,
    searchContextSize: 'low' as SearchContextSize,
    searchAfterDate: '',
    searchBeforeDate: '',
    searchDomains: '',
    searchRecency: 'month' as SearchRecency,
    showAdvancedOptions: false
  });

  const updateField = useCallback(<K extends keyof FactCheckFormState>(
    field: K,
    value: FactCheckFormState[K]
  ) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const updateStatement = useCallback((statement: string) => {
    updateField('statement', statement);
  }, [updateField]);

  const updateModel = useCallback((model: PerplexityModel) => {
    updateField('model', model);
  }, [updateField]);

  const updateSearchContextSize = useCallback((size: SearchContextSize) => {
    updateField('searchContextSize', size);
  }, [updateField]);

  const updateSearchAfterDate = useCallback((date: string) => {
    updateField('searchAfterDate', date);
    // Clear recency when date is set
    if (date) {
      updateField('searchRecency', undefined);
    }
  }, [updateField]);

  const updateSearchBeforeDate = useCallback((date: string) => {
    updateField('searchBeforeDate', date);
    // Clear recency when date is set
    if (date) {
      updateField('searchRecency', undefined);
    }
  }, [updateField]);

  const updateSearchDomains = useCallback((domains: string) => {
    updateField('searchDomains', domains);
  }, [updateField]);

  const updateSearchRecency = useCallback((recency: SearchRecency | undefined) => {
    updateField('searchRecency', recency);
    // Clear dates when recency is set
    if (recency) {
      updateField('searchAfterDate', '');
      updateField('searchBeforeDate', '');
    }
  }, [updateField]);

  const toggleAdvancedOptions = useCallback(() => {
    updateField('showAdvancedOptions', !formState.showAdvancedOptions);
  }, [formState.showAdvancedOptions, updateField]);

  const resetForm = useCallback(() => {
    setFormState({
      statement: '',
      model: 'sonar',
      searchContextSize: 'low',
      searchAfterDate: '',
      searchBeforeDate: '',
      searchDomains: '',
      searchRecency: 'month',
      showAdvancedOptions: false
    });
  }, []);

  const isFormValid = useCallback(() => {
    return formState.statement.trim().length > 0;
  }, [formState.statement]);

  return {
    formState,
    updateField,
    updateStatement,
    updateModel,
    updateSearchContextSize,
    updateSearchAfterDate,
    updateSearchBeforeDate,
    updateSearchDomains,
    updateSearchRecency,
    toggleAdvancedOptions,
    resetForm,
    isFormValid
  };
};
