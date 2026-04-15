import { derived, get, writable } from 'svelte/store'
import Noise from './noise'
import { clock, formatTimeElapsed } from './utils'

const Target = {}
const values = writable({
  td_open: false,
  td_available: false,
  ramp: 0,
  waveformHr: null,
  // just to keep are here
  // renderable
  derived: {
    svv_graph: [],
    svri_graph: [],
    cipc_graph: []
  }
})

const td_values = writable({
  dirty: false
})

const static_keys = [
  'firstname',
  'surname',
  'weight',
  'height',
  'hrCurve',
  'tdCurve',
  'papCurve',
  'tInj',
  'sendCO',
  'gender',
  'age',
  'age_group',
  // ventilation
  'vent_control'
]
const ramp_keys = [
  'sap',
  'dap',
  'hr',
  'cvp',
  'svi',
  'ppv',
  'gedi',
  'elwi',
  'pvpi',
  'tb',
  'svv',
  'scvo',
  'resp',
  'spo2',
  'etco2',
  'd_pmx',
  // pac values
  'pap_systolic',
  'pap_diastolic',
  'rap',
  'pawp',
  'svo2',
  // ventilation
  'peep',
  'p_peak',
  'vt_e',
  'fio2'
]

const minmax_keys = [
  'sap',
  'hr',
  'scvo'
  // "cipc": custom logic
]

const graph_keys = {
  svv: { tddependent: true },
  svri: { tddependent: false },
  cipc: { tddependent: true }
}

const baseline = {
  svi: 62,
  ppv: 40,
  svv: 5,
  sap: 100,
  dap: 100,
  // not sure anymore what baseline does other than a multiplier
  pap_systolic: 100,
  pap_diastolic: 100,
  d_pmx: 1200
}

const deriveMoreValues = (input) => {
  let values = { ...input }
  values.pbw = 50 + 2.3 * (Target.height / 2.54 - 60)
  values.map = values.dap + (values.sap - values.dap) / 3
  values.cipc = (values.svi * values.hr) / 1000
  values.svri = ((values.map - values.cvp) / values.cipc) * 80
  let bsa = Math.sqrt((Target.weight * Target.height) / 3600)
  values.gef = ((4 * (values.svi * bsa)) / (values.gedi * bsa)) * 100
  values.cfi = (values.svi * values.hr) / values.gedi
  values.cpi = values.map * values.cipc * 0.0022
  values.ea_dyn = values.ppv / values.svv
  // PAC and vent derived
  values.m_pap = (values.pap_systolic + 2 * values.pap_diastolic) / 3
  values.mv_e = (values.resp * values.vt_e) / 1000 // convert from ml to L
  values.tv = values.vt_e / values.pbw

  return values
}

const max_cache = {
  sap: 0,
  hr: 0,
  cipc: 0,
  scvo: 0
}

const computeNextTick = () => {
  if ('ramp' in Target) {
    values.update((updated) => {
      if (updated.ramp < Target.ramp) {
        for (let k of static_keys) {
          updated[k] = Target[k]
        }
        const dt = Target.ramp - updated.ramp
        updated.ramp++
        for (let k of ramp_keys) {
          updated[k] = (updated[k] || 0) + (Target[k] - (updated[k] || 0)) / dt
        }
      }
      let noise = Noise.sample()
      updated.derived = updated.derived || {}
      for (let k of ramp_keys) {
        if (baseline[k]) {
          updated.derived[k] = Noise.apply(updated[k], noise, baseline[k])
        } else {
          updated.derived[k] = updated[k]
        }
      }
      updated.derived = deriveMoreValues(updated.derived)
      for (let k of minmax_keys) {
        updated.derived['min_' + k] = Math.min(
          updated.derived[k],
          updated.derived['min_' + k] || Infinity
        )
        updated.derived['max_' + k] = Math.max(
          updated.derived[k],
          updated.derived['max_' + k] || -Infinity
        )
      }

      // manual minmax for cipc
      const current_td_values = get(td_values)
      if (current_td_values.dirty) {
        updated.derived.min_cipc = Math.min(
          updated.derived.cipc,
          updated.derived.min_cipc || Infinity
        )
        updated.derived.max_cipc = Math.max(
          updated.derived.cipc,
          updated.derived.max_cipc || -Infinity
        )
      } else {
        updated.derived.min_cipc = null
        updated.derived.max_cipc = null
      }
      for (let k in graph_keys) {
        if (graph_keys[k].tddependent && !current_td_values.dirty) continue

        const gk = k + '_graph'
        if (!updated.derived[gk]) {
          updated.derived[gk] = []
        } else if (updated.derived[gk].length === 300) {
          updated.derived[gk] = updated.derived[gk].slice(1)
        }
        updated.derived[gk].push(updated.derived[k])
      }
      return updated
    })
  }
}

const computeTdResult = () => {
  td_values.update((updated) => {
    updated.dirty = true
    updated.td_cipc = (Target.svi * Target.hr) / 1000
    updated.gedi = Target.gedi
    let bsa = Math.sqrt((Target.weight * Target.height) / 3600)
    updated.gef = ((4 * (Target.svi * bsa)) / (Target.gedi * bsa)) * 100
    updated.elwi = Target.elwi
    updated.pvpi = Target.pvpi
    updated.svri =
      ((Target.dap + (Target.sap - Target.dap) / 3 - Target.cvp) / updated.td_cipc) * 80
    updated.svv = Target.svv
    updated.cfi = (Target.svi * Target.hr) / Target.gedi
    updated.t_inj = Target.tInj
    updated.delta_t = Target.deltaT
    updated.last_td_at = Date.now()
    return updated
  })
}

const format = (value, precision, placeholder) => {
  return value == null ? placeholder : value.toFixed(precision)
}

const td_elapsed = derived([td_values, clock], ([$td_values]) =>
  formatTimeElapsed($td_values.last_td_at)
)

export { values, td_values, computeNextTick, computeTdResult, format, Target, td_elapsed }
