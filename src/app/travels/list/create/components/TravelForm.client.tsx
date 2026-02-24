'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { Plus, Trash, Calendar, MapPin, Search, GripVertical } from 'lucide-react';

type Place = { id: string | number; title: string; location: string; memo?: string };

export default function TravelForm() {
  const [places, setPlaces] = useState<Place[]>([]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchOpen) return;
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }

    const id = setTimeout(async () => {
      setLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_PLACE_SEARCH_URL}?format=json&q=${encodeURIComponent(query)}&limit=6`;
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'trace-map-app',
          },
        });
        const data = await res.json();
        const mapped = (data || []).map((d: any) => ({
          id: String(d.place_id || d.osm_id || d.lat + d.lon),
          title: String(d.display_name || d.name || ''),
          location: String(d.display_name || ''),
        }));
        setResults(mapped);
      } catch (e) {
        setResults([]);
      }
      setLoading(false);
    }, 400);

    return () => clearTimeout(id);
  }, [query, searchOpen]);

  const addPlaceFromResult = (r: Place) => {
    if (!places.some((p) => p.title === r.title)) {
      setPlaces((p) => [
        ...p,
        { id: Date.now() + '-' + r.id, title: r.title, location: r.location, memo: '' },
      ]);
    }
    setSearchOpen(false);
    setQuery('');
    setResults([]);
  };

  const updateMemo = (id: string | number, memo: string) => {
    setPlaces((p) => p.map((x) => (x.id === id ? { ...x, memo } : x)));
  };

  const removePlace = (id?: string | number) => {
    id && setPlaces((p) => p.filter((x) => x.id !== id));
  };

  // drag and drop for reordering
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: any, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', String(index));
    } catch (err) {}
  };

  const handleDragOver = (e: any, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: any, index: number) => {
    e.preventDefault();
    const from = dragIndex ?? Number(e.dataTransfer.getData('text/plain'));
    const to = index;
    if (from === null || from === to) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    setPlaces((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved!);
      return next;
    });

    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* 좌측 지도 영역 */}
      <div className="lg:col-span-2">
        <div className="bg-muted/20 h-130 w-full overflow-hidden rounded-lg border">
          {/* 실제 맵 컴포넌트가 들어갈 자리 */}
        </div>

        <div className="mt-6">
          <h4 className="mb-3 text-sm font-semibold text-neutral-400">다녀온 곳</h4>

          <div className="flex flex-col gap-3">
            {places.length > 0 ? (
              places.map((place, idx) => (
                <div
                  key={place.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={(e) => handleDrop(e, idx)}
                  className={`flex items-center justify-between gap-4 rounded-lg border bg-transparent p-3 transition-colors ${
                    dragIndex === idx ? 'opacity-60' : ''
                  } ${dragOverIndex === idx ? 'bg-primary/20' : ''} hover:bg-primary/30`}
                >
                  <div className="flex items-center gap-3">
                    <div className="cursor-grab px-2">
                      <GripVertical className="text-muted-foreground h-5 w-5" />
                    </div>
                    <div>
                      <div className="leading-tight font-semibold">{place.title}</div>
                      <div className="text-muted-foreground truncate text-sm">{place.memo}</div>
                    </div>
                  </div>

                  <button
                    className="text-muted-foreground hover:text-foreground rounded p-2 hover:bg-white/6"
                    onClick={() => removePlace(place.id)}
                    aria-label="삭제"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground rounded border px-4 py-6">
                다녀온 장소가 없습니다. 장소를 추가해주세요.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 우측 폼 영역 */}
      <div className="space-y-5">
        {/* 우측에도 선택된 리스트 표시 (투명, hover시 강조) + 메모 입력 가능 */}
        <div className="flex flex-col gap-3">
          <Label>선택된 장소</Label>
          {places.length > 0 &&
            places.map((place) => (
              <div
                key={place.id}
                className="bg-muted/20 rounded-lg border border-transparent p-3 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm leading-tight font-semibold">{place.title}</div>
                      <div className="text-muted-foreground text-xs">{place.location}</div>
                    </div>
                    <Input
                      value={place.memo || ''}
                      placeholder="이 장소에 대한 메모를 입력하세요."
                      onChange={(e) => updateMemo(place.id, e.target.value)}
                      className="mt-2 w-full border-0 p-0 shadow-none focus:ring-0 focus-visible:ring-0"
                    />
                  </div>

                  <button
                    className="text-muted-foreground hover:text-foreground rounded p-2 hover:bg-white/6"
                    onClick={() => removePlace(place.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>

        <div>
          <button
            onClick={() => setSearchOpen((s) => !s)}
            className="text-primary hover:bg-primary/5 flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
          >
            <Plus className="h-4 w-4" /> 장소 추가하기
          </button>

          {searchOpen && (
            <div className="bg-card mt-3 rounded-md border p-3">
              <div className="flex items-center gap-2">
                <Search className="text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="장소를 검색하세요 (3자 이상)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="mt-3 flex max-h-52 flex-col gap-2 overflow-auto">
                {loading ? (
                  <div className="text-muted-foreground text-sm">검색 중...</div>
                ) : results.length > 0 ? (
                  results.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => addPlaceFromResult(r)}
                      className="hover:bg-muted/10 flex items-start gap-3 rounded-md px-3 py-2 text-left"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="truncate">
                        <div className="truncate font-medium">{r.title}</div>
                        <div className="text-muted-foreground truncate text-sm">{r.location}</div>
                      </div>
                    </button>
                  ))
                ) : query.trim().length >= 3 ? (
                  <div className="text-muted-foreground text-sm">검색 결과가 없습니다.</div>
                ) : (
                  <div className="text-muted-foreground text-sm">3자 이상 입력하면 검색합니다.</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>여행 제목</Label>
          <Input placeholder="여행 제목을 입력하세요." />
        </div>

        <div>
          <Label>여행 날짜</Label>
          <div className="mt-2 flex gap-2">
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <Calendar className="h-4 w-4" />
              </InputGroupAddon>
              <InputGroupInput type="date" />
            </InputGroup>

            <InputGroup>
              <InputGroupAddon align="inline-start">
                <Calendar className="h-4 w-4" />
              </InputGroupAddon>
              <InputGroupInput type="date" />
            </InputGroup>
          </div>
        </div>

        <div>
          <Label>메모</Label>
          <Textarea placeholder="여행에 대한 간단한 메모를 작성해보세요." className="mt-2 h-24" />
        </div>

        <div>
          <Label>동행자</Label>
          <Input placeholder="여행을 함께한 친구를 기록해보세요." className="mt-2" />
          <div className="text-muted-foreground mt-2 text-sm">예: 김철수, 홍길동</div>
        </div>

        <div>
          <Label>사진 추가 (선택)</Label>
          <div className="border-input text-muted-foreground mt-2 flex h-28 w-full items-center justify-center rounded-md border border-dashed">
            사진을 업로드하려면 클릭하거나 드래그하세요.
          </div>
        </div>

        <Button className="w-full">저장하기</Button>
      </div>
    </div>
  );
}
