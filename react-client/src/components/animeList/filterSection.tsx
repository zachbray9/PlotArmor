import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, Portal, Select, Stack, Text } from "@chakra-ui/react";
import { sortCollection, watchStatusCollection } from "../../constants/formCollections";

interface Props {
    searchQuery: string
    onSearchChange: (value: string) => void
    watchStatusFilter: string | null
    onWatchStatusChange: (value: string | null) => void
    sortPreference: string
    onSortChange: (value: string) => void
}

export default function FilterSection({searchQuery, onSearchChange, watchStatusFilter, onWatchStatusChange, sortPreference, onSortChange} : Props) {
    return (
        <Stack gap='1rem'>
            <InputGroup startElement={<SearchIcon color='text.subtle' />}>
                <Input placeholder="Search" variant='outline' value={searchQuery} onChange={e => onSearchChange(e.target.value)} />
            </InputGroup>

            <Stack gap='0.5rem'>
                <Text fontSize='sm' color='text.subtle'>Filters</Text>

                {/* watch status filter */}
                <Select.Root
                    collection={watchStatusCollection}

                    value={watchStatusFilter ? [watchStatusFilter] : []}
                    onValueChange={({ value }) => {
                        onWatchStatusChange(value[0])
                    }}
                >
                    <Select.HiddenSelect />
                    <Select.Label />

                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Watch status..." />
                        </Select.Trigger>

                        <Select.IndicatorGroup>
                            <Select.Indicator />
                            <Select.ClearTrigger />
                        </Select.IndicatorGroup>

                    </Select.Control>

                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {watchStatusCollection.items.map((item) => (
                                    <Select.Item key={item.value} item={item.value}>
                                        {item.label}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>

            </Stack>

            <Stack gap='0.5rem'>
                <Text fontSize='sm' color='text.subtle'>Sort</Text>

                {/* Sort preference filter */}
                <Select.Root
                    collection={sortCollection}
                    value={[sortPreference]}
                    onValueChange={({ value }) => {
                        onSortChange(value[0]);
                    }}
                >
                    <Select.HiddenSelect />
                    <Select.Label />

                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Sort by..." />
                        </Select.Trigger>

                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>

                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {sortCollection.items.map((item) => (
                                    <Select.Item key={item.value} item={item.value}>
                                        {item.label}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Stack>
        </Stack>
    )
}