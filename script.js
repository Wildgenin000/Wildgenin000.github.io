document.addEventListener('DOMContentLoaded', () => {
    const codeDisplay = document.getElementById('codeDisplay');
    const codeElement = codeDisplay.querySelector('code');
    
    const algorithms = {
        "Bubble Sort": `
// Bubble Sort in C
#include <stdio.h>
#include <stdlib.h>

void bubbleSort(int arr[], int n) {
    int sortat;
    do
    {
        sortat = 1;
        for(int i = 0; i < n-1; i++)
            if(arr[i] > arr[i+1])
            {
                int temp = arr[i];
                arr[i] = arr[i+1];
                arr[i+1] = temp;
                sortat = 0;
            }
    }
    while(!sortat);
}`,
        "Selection Sort": `
// Selection Sort in C
#include <stdio.h>
#include <stdlib.h>

void selectionSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        int minIndex = i;
        for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        int temp = arr[minIndex];
        arr[minIndex] = arr[i];
        arr[i] = temp;
    }
}`,
        "Insertion Sort": `
// Insertion Sort in C
#include <stdio.h>
#include <stdlib.h>

void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int x = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > x) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = x;
    }
}`,
        "Merge Sort": `
// Merge Sort in C
#include <stdio.h>
#include <stdlib.h>

void merge_left_right(int *vector, int left, int middle, int right)
{
    int iterator_left, iterator_right, merge_iterator;
    int no_elements_left = middle - left + 1;
    int no_elements_right = right - middle;

    int *vector_left = calloc(no_elements_left, sizeof(int));
    int *vector_right = calloc(no_elements_right, sizeof(int));

    for (iterator_left = 0; iterator_left < no_elements_left; iterator_left++)
        vector_left[iterator_left] = vector[left + iterator_left];
    for (iterator_right = 0; iterator_right < no_elements_right; iterator_right++)
        vector_right[iterator_right] = vector[middle + 1 + iterator_right];

    iterator_left = 0;
    iterator_right = 0;
    merge_iterator = left;
    while (iterator_left < no_elements_left && iterator_right < no_elements_right)
    {
        if (vector_left[iterator_left] <= vector_right[iterator_right])
        {
            vector[merge_iterator] = vector_left[iterator_left];
            iterator_left++;
        }
        else
        {
            vector[merge_iterator] = vector_right[iterator_right];
            iterator_right++;
        }
        merge_iterator++;
    }

    while (iterator_left < no_elements_left) {
        vector[merge_iterator] = vector_left[iterator_left];
        iterator_left++;
        merge_iterator++;
    }
    
    while (iterator_right < no_elements_right) {
        vector[merge_iterator] = vector_right[iterator_right];
        iterator_right++;
        merge_iterator++;
    }

    free(vector_left);
    free(vector_right);
}

void mergeSort(int *arr, int left, int right){
    if (left < right){
        int middle = (left + right) / 2;
        mergeSort(arr, left, middle);
        mergeSort(arr, middle + 1, right);
        merge_left_right(arr, left, middle, right);
    }
}`,
        "Quick Sort": `
// Quick Sort in C
#include <stdio.h>
#include <stdlib.h>

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
        "Heap Sort": `
// Heap Sort in C
#include <stdio.h>
#include <stdlib.h>

void heapify(int arr[], int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;
    if (largest != i) {
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n - 1; i >= 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}`,
        "Radix Sort": `
// Radix Sort in C
#include <stdio.h>
#include <stdlib.h>

int getMax(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++)
        if (arr[i] > max)
            max = arr[i];
    return max;
}

void countSort(int arr[], int n, int exp) {
    int output[n];
    int i, count[10] = {0};
    
    for (i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;
        
    for (i = 1; i < 10; i++)
        count[i] += count[i - 1];
        
    for (i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }
    
    for (i = 0; i < n; i++)
        arr[i] = output[i];
}

void radixSort(int arr[], int n) {
    int m = getMax(arr, n);
    for (int exp = 1; m / exp > 0; exp *= 10)
        countSort(arr, n, exp);
}`,
        "Linear Search": `
// Linear Search in C
#include <stdio.h>
#include <stdlib.h>

int linearSearch(int arr[], int n, int x) {
    for (int i = 0; i < n; i++)
        if (arr[i] == x)
            return i; // Return the index of the found element
    return -1; // Element not found
}`,
        "Binary Search": `
// Binary Search in C
#include <stdio.h>
#include <stdlib.h>

int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x)
            return m; // Element found
        if (arr[m] < x)
            l = m + 1;
        else
            r = m - 1;
    }
    return -1; // Element not found
}`,
        "Jump Search": `
// Jump Search in C
#include <stdio.h>
#include <stdlib.h>
#include <math.h>

int min(int a, int b) { 
    return (a < b) ? a : b; 
}

int jumpSearch(int arr[], int x, int n) {
    int step = sqrt(n);
    int prev = 0;
    
    while (arr[min(step, n) - 1] < x) {
        prev = step;
        step += sqrt(n);
        if (prev >= n)
            return -1;
    }
    
    while (arr[prev] < x) {
        prev++;
        if (prev == min(step, n))
            return -1;
    }
    
    if (arr[prev] == x)
        return prev;
    return -1;
}`
    };

    // Event delegation for algorithm selection
    document.querySelector('.container').addEventListener('click', (e) => {
        if (e.target.matches('.list-group-item')) {
            // Add loading state
            codeDisplay.classList.add('loading');
            
            // Update code content
            codeElement.textContent = algorithms[e.target.textContent];
            
            // Apply syntax highlighting
            Prism.highlightElement(codeElement);
            
            // Remove loading state
            setTimeout(() => {
                codeDisplay.classList.remove('loading');
            }, 200);
        }
    });

    // Keyboard navigation
    document.querySelectorAll('.list-group-item').forEach(item => {
        item.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });

    // Initial highlighting
    if (window.Prism) {
        Prism.highlightAll();
    }
});
