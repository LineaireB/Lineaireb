import { vi } from 'vitest'
import { MapViewMock } from '@/__tests__/helpers/mapViewMock'

vi.mock('@/features/map/MapView', () => ({
  default: MapViewMock,
}))
